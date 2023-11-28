export interface CallEventsSubscriptionResponse {
  callEventsWebSocketURL: string;
}

export interface Metadata {
  direction: string;
  accountKey: string;
  callCreated: string;
}

export enum ParticipantTypeValue {
  PhoneNumber = "PHONE_NUMBER",
}

export interface ParticipantType {
  value: string;
  name: string;
}

export interface PhoneNumberParticipantType extends ParticipantType {
  value: string;
  name: string;
  caller?: {
    name: string;
    number: string;
  };
}

export interface Participant {
  id: string;
  type: ParticipantType;
  status: {
    value: string;
  };
}

export interface PhoneNumberParticipant extends Participant {
  id: string;
  type: {
    value: string;
    name: string;
    caller?: {
      name: string;
      number: string;
    };
  };
  status: {
    value: string;
  };
}

export interface State {
  id: string;
  type: string;
  sequenceNumber: number;
  timestamp: string;
  participants: Participant[];
}

export interface CallEvent {
  metadata: Metadata;
  state: State;
}

// In the case of an INBOUND call, we expect a PHONE_NUMBER participant.
export class InboundCaller {
  name: string = "N/A";
  number: string = "N/A";

  constructor(participantType: ParticipantType) {
    if (participantType.value === ParticipantTypeValue.PhoneNumber) {
      const phoneNumberParticipantType =
        participantType as PhoneNumberParticipantType;
      if (phoneNumberParticipantType.caller) {
        this.name = phoneNumberParticipantType.caller.name;
        this.number = phoneNumberParticipantType.caller.number;
      }
    } else {
      this.name = participantType.name;
    }
  }

  static get(participantType: ParticipantType): InboundCaller {
    return new InboundCaller(participantType);
  }
}
