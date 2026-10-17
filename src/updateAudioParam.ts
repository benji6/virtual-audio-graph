type AutomationMethod =
  | "cancelAndHoldAtTime"
  | "cancelScheduledValues"
  | "exponentialRampToValueAtTime"
  | "linearRampToValueAtTime"
  | "setTargetAtTime"
  | "setValueAtTime"
  | "setValueCurveAtTime";

type AutomationEvent = {
  [Method in AutomationMethod]: [Method, ...Parameters<AudioParam[Method]>];
}[AutomationMethod];

type AudioParamValue = number | AutomationEvent | AutomationEvent[];

export default function updateAudioParam(
  audioParam: AudioParam,
  value: AudioParamValue,
  resetAutomation: boolean,
): void {
  if (resetAutomation) audioParam.cancelScheduledValues(0);
  if (!Array.isArray(value)) {
    audioParam.value = value;
    return;
  }
  const events =
    value.length === 0 || Array.isArray(value[0])
      ? (value as AutomationEvent[])
      : [value as AutomationEvent];
  for (const [method, ...args] of events) {
    Reflect.apply(audioParam[method], audioParam, args);
  }
}
