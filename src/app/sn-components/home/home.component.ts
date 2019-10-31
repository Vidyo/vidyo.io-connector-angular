// This statement will load the home component first, so that video container div element is available.
import {ScriptService} from "../../script.service";

declare const require: any;

import {Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';

/**
 * Home Component
 */
@Component({
  selector: '`app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  public HOST = "prod.vidyo.io"
  public DISPLAY_NAME = "Angular User"; // default username
  public RESOURCE = "demoRoom"; // default room id

  /* Generate token at developer console: https://developer.vidyo.io/#/generate-token */
  public TOKEN = "PLACE TOKEN HERE";

  /* Preview button display toggle control */
  public cameraPrivacy: boolean = false;

  /* Mute button display toggle control */
  public microphonePrivacy: boolean = false;

  /* Call Connect button display toggle control */
  public connected: boolean = false;

  public userName = this.DISPLAY_NAME;

  public connectionStatus = "Awaiting connection";

  private scriptService: ScriptService;

  /**
   * Constructor
   *
   * @param matDialog, material modal dialog
   */
  constructor(private cdr: ChangeDetectorRef) {
    this.scriptService = new ScriptService()
  }

  ngOnInit() {

  }  
  
  private onVidyoClientLoadCallback: Function = (status) => {
    console.log("VidyoClient load status: " + status);

    /* Register all the listeners */
    this.registerCameraEventListener();
    this.registerMicrophoneEventListener();
    this.registerLocalSpeakerEventListener();
    this.registerParticipantEventListener();
  }

  ngAfterViewInit() {  
    /* Pass the callback to JS layer */
    registerLoadEventCallback(this.onVidyoClientLoadCallback);

    this.scriptService.load('VidyoClient').then(data => {
      console.log('script loaded ', data);
    }).catch(error => console.log(error));
  }

  registerCameraEventListener() {
    vidyoConnector.RegisterLocalCameraEventListener({
      onAdded: localCamera => {
        console.log("Added camera:" + localCamera.name);
      },
      onRemoved: localCamera => { },
      onSelected: localCamera => {
        console.log("Local camera selected: " + localCamera.name);
      },
      onStateUpdated: (localCamera, state) => { }
    }).then(() => {
      console.log("RegisterLocalCameraEventListener Success");
    }).catch(() => {
      console.error("RegisterLocalCameraEventListener Failed");
    });
  }

  registerMicrophoneEventListener() {
    vidyoConnector.RegisterLocalMicrophoneEventListener({
      onAdded: localMicrophone => {
        console.log("Added microphone:" + localMicrophone.name);
      },
      onRemoved: localMicrophone => {
        console.log("Removed microphone:" + localMicrophone.name);
      },
      onSelected: localMicrophone => {
        if (localMicrophone) {
          console.log("Selected microphone:" + localMicrophone.name);
        }
      },
      onStateUpdated: (localMicrophone, state) => { 
        if (localMicrophone) {
          console.log("Microphone updated:" + localMicrophone.name + ", State: " + state);
        }
      }
    }).then(function () {
      console.log("RegisterLocalMicrophoneEventListener Success");
    }).catch(function () {
      console.error("RegisterLocalMicrophoneEventListener Failed");
    });
  }

  private registerLocalSpeakerEventListener() {
    vidyoConnector.RegisterLocalSpeakerEventListener({
      onAdded: localSpeaker => { 
        console.log("Added speaker:" + localSpeaker.name);
      },
      onRemoved: localSpeaker => { 
        console.log("Removed speaker:" + localSpeaker.name);
      },
      onSelected: localSpeaker => {
          if (localSpeaker) {
           console.log("Speaker updated:" + localSpeaker.name);
          }
      },
      onStateUpdated: (localSpeaker, state) => {
          if (localSpeaker) {
            console.log("Selected speaker:" + localSpeaker.name + ", State: " + state);
          }
       }
    }).then(function () {
      console.log("RegisterLocalSpeakerEventListener Success");
    }).catch(function () {
      console.error("RegisterLocalSpeakerEventListener Failed");
    });
  }

  /**
   * It will connect to the video call using VidyoConnector#Connect api.
   */
  startVideoCall() {
    this.connectionStatus = "Connecting";

    if (this.DISPLAY_NAME != "" && this.RESOURCE != "" && this.TOKEN != "") {
      vidyoConnector.Connect({
        host: this.HOST,
        token: this.TOKEN,
        displayName: this.DISPLAY_NAME,
        resourceId: this.RESOURCE,
        onSuccess: () => {
          console.log("Connected");
          this.connected = true;

          this.updateStatus("Connected");
        },
        onFailure: reason => {
          this.connected = false;
          console.error("Connection Failed : ", reason);

          this.updateStatus("Connection failed");
        },
        onDisconnected: reason => {
          this.connected = false;
          console.log("Connection Disconnected - " + reason);

          this.updateStatus("Disconnected");
        }
      }).then(status => {
        if (status) {
          this.connected = true;
        }
      }).catch(() => {
        console.log('Connect Error');

        this.updateStatus("Connection failed");
      });
    }
  }

  /**
   * Register for Participant add/join events.
   */
  private registerParticipantEventListener() {
    console.log("Registering for Participant's events");
    let that = this; // can use .bind() as well.

    vidyoConnector.RegisterParticipantEventListener(
      {
        onJoined: (participant) => {
          console.log('Joined', participant);
        },
        onLeft: (participant) => {
          console.log('Left', participant);
        },
        onDynamicChanged: (participants, cameras) => {
        },
        onLoudestChanged: (participant, audioOnly) => {
        }
      }
    ).then(() => {
      console.log("Registered with Participant Events Listener");
    }).catch((e) => {
      console.log(`Error while registering with Participant Events Listener ${e}`);
    });
  }

  /**
   * Toggles the preview button/functionality
   */
  togglePreview() {
    this.cameraPrivacy = !this.cameraPrivacy;
    console.log(`Toggle Preview to: ${this.cameraPrivacy}`);

    vidyoConnector.SetCameraPrivacy({
      privacy: this.cameraPrivacy
    }).then(function() {
      console.log("SetCameraPrivacy Success");
    }).catch(function() {
      console.error("SetCameraPrivacy Failed");
    });
  }

  /**
   * Toggles the mic button/functionality
   */
  toggleMic() {
    this.microphonePrivacy = !this.microphonePrivacy;
    console.log(`Toggle mic muted to: ${this.microphonePrivacy}`);

    vidyoConnector.SetMicrophonePrivacy({
      privacy: this.microphonePrivacy
    }).then(function() {
      console.log("SetMicrophonePrivacy Success");
    }).catch(function() {
      console.error("SetMicrophonePrivacy Failed");
    });
  }

  /**
   * Toggles the video call button/functionality
   */
  toggleConnect() {
    if (this.connected) {
      console.debug("Disconnecting video call");
      vidyoConnector.Disconnect();

      this.updateStatus("Disconnecting...");
    } else {
      this.startVideoCall();
    }
  }

  private updateStatus(status: string) {
    this.connectionStatus = status;
    this.cdr.detectChanges();
}
}