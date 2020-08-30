import { showNotification, showErrorNotification } from '@vaadin/flow-frontend/a-notification';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-ordered-layout';
import * as ThereminRecordService from '../../generated/ThereminRecordService';
import { css, customElement, html, LitElement, query } from 'lit-element';
import OscillatorData from '../../generated/org/vaadin/ronny/backend/OscillatorData';

@customElement('u-s-bsounds-view')
export class USBsoundsView extends LitElement {
  name: string = '';
  muted: boolean = false;
  count: number = 0;
  //original frequency range as per 
  //http://web.physics.ucsb.edu/~lecturedemonstrations/Composer/Pages/60.17.html
  minFrequency: number = 65;
  maxFrequency: number = 3000;
  audioContext: AudioContext = new AudioContext();
  gain: GainNode = this.audioContext.createGain();
  osci : OscillatorNode = this.audioContext.createOscillator();
  currentModel : any;

  
  @query('#volumeSlider')
  private volumeSlider: any;

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1em;
        height: 100%;
        width: 100%;
      }
      .upsideDown{
         transform : rotate(180deg);
      }
    `;
  }

  constructor(){
    super();
    this.gain.gain.value=0.02;
    this.gain.connect(this.audioContext.destination);
    this.addEventListener('mousemove', this.updateOscillator);
  }

  firstUpdated(){
    showNotification('Welcome to TheremUSB! Start by connecting one or more USB device(s). ' +
    'A sound generator is created from the IDs of all connected devices. Add/remove devices to alter the tone.'+
    '\n Mix and match as you like. If all else fails, simply switch to the default one. :)'+
    '\n\nYou can change the frequency by moving the mouse left and right. '+
    ' Upwards and downwards mouse movement controls the stepness of the generated '+
    'audio waves. Depending on the frequency the effect on one or the other axis ' 
    +'might be less noticeable.', {duration: -1, position: 'middle'} )
  }

  render() {
    return html`
    <vaadin-vertical-layout>

     <vaadin-horizontal-layout>
       <iron-icon icon="vaadin:volume-off"></iron-icon>
       <input type="range" id="volumeSlider" min="0" max="0.1" value="0.02" step="0.002"
           @input="${this.volumeChanged}">
       <iron-icon icon="vaadin:volume"></iron-icon>
     </vaadin-horizontal-layout>
    
     <vaadin-horizontal-layout>
      <vaadin-button id="connectButton" @click="${this.connectDevices}">
      <iron-icon icon="vaadin:connect" slot="prefix"></iron-icon>
      Connect
      </vaadin-button>

      &nbsp;

      <vaadin-button @click="${this.generateDefault}">
      <iron-icon icon="vaadin:funcion" slot=prefix></iron-icon>
      Default sound
      </vaadin-button>
      </vaadin-horizontal-layout>

    </vaadin-vertical-layout>
    `;
  }

  generateDefault(){
    this.osci.disconnect();
    let x : OscillatorData = {
      detuneStepsInCents:100,
      frequency:500,
      waveType:0
    };
    this.switchOscillator(x);
  }

  updateOscillator(e:MouseEvent){
    if(typeof this.currentModel === 'undefined' ){
      return;
    }

    //calculate new values
    //delta x is a change in frequency
    //delta y a change in detune

    //allow frequency shifts up to 10% of current frequency
    //scale factor from 0.9 to 1.1
    let scale = 0.9+(e.offsetX/window.innerWidth)*2/10;
    let newFreq = this.currentModel.frequency * scale;

    //allow detune steps from 5 to 200
    let newDetune =Math.max(5, 200*(e.offsetY/window.innerHeight));
    this.osci.detune.setValueAtTime(newDetune, this.audioContext.currentTime);
    this.osci.frequency.setValueAtTime(newFreq, this.audioContext.currentTime);

    console.debug(newFreq+":"+newDetune);
  }

  volumeChanged(_: InputEvent){
    console.log(this.volumeSlider.value);
    this.gain.gain.value=this.volumeSlider.value;
  }

  updateAudio(){
    this.osci.disconnect();

    //@ts-ignore
    let ids = navigator.usb.getDevices().then(
      (devices:any) => devices.map( (x:any) => x.serialNumber )
    )

    ids.then( (x:string[]) => {
      console.debug(x);
      return ThereminRecordService.getOscillatorData(x, this.minFrequency, this.maxFrequency);
    }).then( (data:OscillatorData) => {
      console.debug(data.detuneStepsInCents+':'+data.frequency+':'+data.waveType);
      this.switchOscillator(data);
    });
    
  }
  switchOscillator(data: OscillatorData) {
    //save value
    this.currentModel=data;
    console.debug(this.currentModel);

    this.osci = this.audioContext.createOscillator();
    switch(data.waveType){
      case 0: this.osci.type='sine'; break;
      case 1: this.osci.type='square'; break;
      case 2: this.osci.type='sawtooth'; break;
      case 3: this.osci.type='triangle'; break;
      default: this.osci.type='sine'; break;
    }
    this.osci.frequency.setValueAtTime(data.frequency, this.audioContext.currentTime); // value in hertz
    this.osci.detune.setValueAtTime(data.detuneStepsInCents, this.audioContext.currentTime); //detune steps
    this.osci.connect(this.gain);
    this.osci.start();
  }

  connectDevices(){
      //@ts-ignore
      navigator.usb.requestDevice({ filters: [{  }] }) //non-standard as of now
      .then( (device:any) => { 
         showNotification('Connected: '+device.manufacturerName+' '+device.productName) 
         this.updateAudio();
        } )
      .catch( (_:any) => {showErrorNotification('No new device connected.')});

  }

}
