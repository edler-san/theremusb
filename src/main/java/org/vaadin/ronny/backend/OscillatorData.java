package org.vaadin.ronny.backend;

public class OscillatorData {

	private int waveType = 0; //corresponds to sine
	private double frequency = 0;
	private int detuneStepsInCents = 100;
	
	public OscillatorData(int waveType, double frequency, int detuneStepsInCents) {
		this.waveType=waveType;
		this.frequency=frequency;
		this.detuneStepsInCents=detuneStepsInCents;
	}

	public int getWaveType() {
		return waveType;
	}

	public void setWaveType(int waveType) {
		this.waveType = waveType;
	}

	public double getFrequency() {
		return frequency;
	}

	public void setFrequency(double frequency) {
		this.frequency = frequency;
	}

	public int getDetuneStepsInCents() {
		return detuneStepsInCents;
	}

	public void setDetuneStepsInCents(int detuneStepsInCents) {
		this.detuneStepsInCents = detuneStepsInCents;
	}

}
