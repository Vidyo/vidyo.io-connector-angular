var vidyoConnector;

var onVidyoClientLoadedInjected;

function registerLoadEventCallback(callback) {
  this.onVidyoClientLoadedInjected = callback;
}

function onVidyoClientLoaded(status) {
  console.log("Loaded status. ", status);

  switch (status.state) {
    case "READY":
      VC.CreateVidyoConnector({
        viewId: "connected-video-chat",
        viewStyle: "VIDYO_CONNECTORVIEWSTYLE_Default",
        remoteParticipants: 10,
        logFileFilter: "warning error all@VidyoConnector info@VidyoClient",
        logFileName: "VidyoClientLog.log",
        userData: ""
      }).then(vc => {
        console.log("VidyoClient Success", vc);
        vidyoConnector = vc;

        /* Notify Angular layer about successful load event */
        if (onVidyoClientLoadedInjected != null) {
          onVidyoClientLoadedInjected(true);
        } else {
          console.log("Callback is not available.");
        }
      }).catch(error => {
        console.log("VidyoClient failed", error);
        onVidyoClientLoaded(status);
      });
      break;
    case "RETRYING":             // The library operating is temporarily paused
      console.log("RETRYING");
      break;
    case "FAILED":               // The library operating has stopped
      console.log("FAILED");
      onVidyoClientLoadedInjected(false);
      break;
    case "FAILEDVERSION":
      console.log("FAILEDVERSION");
      onVidyoClientLoadedInjected(false);
      break;
    case "NOTAVAILABLE":         // The library is not available
      console.log("NOTAVAILABLE");
      onVidyoClientLoadedInjected(false);
      break;
  }
  return true;                   // Return true to reload the plugins if not available
}

function RefreshView() {
  var rndr = document.getElementById('connected-video-chat');
  vidyoConnector.ShowViewAt({ viewId: "connected-video-chat", x: rndr.offsetLeft, y: rndr.offsetTop, width: rndr.offsetWidth, height: rndr.offsetHeight });
  console.log("Show View At called: " + rndr.offsetLeft + ", " + rndr.offsetTop + ", " + rndr.offsetWidth + ", " + rndr.offsetHeight);
}