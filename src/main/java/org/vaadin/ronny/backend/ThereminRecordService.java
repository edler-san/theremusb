package org.vaadin.ronny.backend;

import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;

@Endpoint
@AnonymousAllowed
public class ThereminRecordService {
	
	public OscillatorData getOscillatorData(String[] ids, int minFreq, int maxFreq) {
		if(ids==null || ids.length==0) {
			return new OscillatorData(0, Math.min(maxFreq, Math.max(minFreq, 3000)), 100);
		}
		
		int key = 0;
		for(String s : ids) {
			key ^= ("Shoopdawoop"+s).hashCode();
		}
		
		long keyAbsolute = Math.abs(key);
		//extract waveType, frequency, detuneStepsInCents
		int detuneSteps = (int)(keyAbsolute % 100);
		double frequency = ( (keyAbsolute/100) % 10000 );
		//this goes from 0 to 9999 hertz -> adjust to min/maxFrequency
		double scaledFreq = (frequency/10000.0)*(maxFreq-minFreq)+minFreq;
		int type = (int)(keyAbsolute/(10000*100) % 4);

		return new OscillatorData(type, scaledFreq, detuneSteps);
	}

}
