const region = "us-east-1";
const secretAccessKey = "OKTAIWBPWhXweY059wfv5Fy52eToiN8SG3kHeA+B";
const secretAccessId = "AKIA2GRP3G4SOW74LRUJ";
let channel_id = "arn:aws:ivschat:us-east-1:701253760804:room/KkXuKTm9fqjz";
let channel_id_private =
  "arn:aws:ivschat:us-east-1:701253760804:room/MjmBSFqWGelM";
const ingest_key = "562d3781dc12.global-contribute.live-video.net";
const stream_key = "sk_us-east-1_2S1fpt3YXCr7_trBM0OuyIhazGXENgeXlGJE4mACmfm";
let total_donations = 0;
const streamArnTemp = "arn:aws:ivs:us-east-1:701253760804:channel/QUO1ToasohoT";
let privateStreamPrice = 1;
let channelConnection;
let privateConnection;
let ClientToken;
let privateRequests = [];
let updateViewerInterval;
let goals = [],
  goalCount = 0;
let streamArn, privateStreamArn;
let selectedCamera, selectedMicrophone;
let privateStreamClient = null;
let priavteSecondsRemaining = 0,
  privateMinutesReamining = 0,
  isPrivateStreamHealthy = false;
let privateHealthCheckInterval;
let timer;
let privateStreamViewPrice = 1;
let private_chat_timer_interval;
let isPrivateStreamPaused = false;
let timeElapsed = 0;
let roomRules = "";
let deduct = "0";
let messageUserId = "";
let channel_description = "";
const tagsList = [
  "music",
  "sports",
  "cooking",
  "travel",
  "fitness",
  "art",
  "technology",
  "fashion",
  "beauty",
  "lifestyle",
  "education",
  "news",
  "animals",
  "outdoors",
  "home",
  "garden",
  "photography",
  "language",
  "games",
  "hobbies",
  "other",
];
var selectedTags = [];
var toBeDeletedTags = [];
let muted = false;
const insertPausePlaceholderIVS = () => {
  const imagePath = "./assets/pause.jpeg";
  const img = new Image();
  img.src = imagePath;
  img.onload = function () {
    createImageBitmap(img).then(function (imageBitmap) {
      client.addImageSource(imageBitmap, "vod-0", { index: 1 });
    });
  };
  client.disableAudio();
};
const toasts = new Toasts({
  width: 300,
  timing: "ease",
  duration: "0.5s",
  dimOld: false,
  position: "top-right",
});

// Function to create and show a toast
function showToast(title, content, style) {
  toasts.push({
    title: title,
    content: content,
    style: style,
  });
}
const removePausePlaceholderIVS = () => {
  client.removeImage("vod-0");
  client.enableAudio();
};
const pauseChat = async () => {
  console.log(document.getElementById("pauseChatButton").innerText);
  if (
    document.getElementById("pauseChatButton").innerText == "Continue Stream"
  ) {
    removePausePlaceholderIVS();
    document.getElementById("streampause").style.display = "block";
    document.getElementById("streamcontinue").style.display = "none";

    document.getElementById("pauseChatButton").innerText = "loading...";
    const response = await send_event(
      region,
      secretAccessKey,
      secretAccessId,
      channel_id,
      "continue-channel"
    );
    var element = document.getElementById("statusImage");
    if (typeof element != "undefined" && element != null) {
      element.remove();
    }
    // document.getElementById("preview").style.display = "block";
    await pause_continue_channel(
      region,
      secretAccessKey,
      secretAccessId,
      channel_id,
      "not-paused"
    );
    // document.getElementById(
    //   "streamStatus"
    // ).innerHTML = `<h4>Stream Status: Active (People Can Watch And Send Messages In Chat.)</h4>`;
    console.log({
      response,
    });
    document.getElementById("pauseChatButton").innerText = "Pause Stream";
    document.getElementById("sendButton").disabled = false;
  } else {
    insertPausePlaceholderIVS();
    document.getElementById("streampause").style.display = "none";
    document.getElementById("streamcontinue").style.display = "block";
    document.getElementById("pauseChatButton").innerText = "loading...";
    const response = await send_event(
      region, // Replace with your chatroom region
      secretAccessKey, // Replace with your secret access key
      secretAccessId, // Replace with your secret key id
      channel_id,
      "pause-channel"
    );
    // document.getElementById("preview").style.display = "none";
    // insertImage("./assets/pause.jpeg");
    await pause_continue_channel(
      region, // Replace with your chatroom region
      secretAccessKey, // Replace with your secret access key
      secretAccessId, // Replace with your secret key id
      channel_id,
      "paused"
    );
    console.log({
      response,
    });
    document.getElementById("pauseChatButton").innerText = "Continue Stream";
    document.getElementById("sendButton").disabled = true;
    // document.getElementById(
    //   "streamStatus"
    // ).innerHTML = `<h4>Stream Status: Paused. (People can see you are active but can't watch or send messages)</h4>`;
  }

  return;
};
const insertImage = src => {
  var element = document.getElementById("statusImage");
  if (typeof element != "undefined" && element != null) {
    element.remove();
  }
  const imageElement = document.createElement("img");
  const { width, height } = config.streamConfig.maxResolution;
  imageElement.style = `width:100%;height:${height}px;`;
  imageElement.setAttribute("id", "statusImage");
  imageElement.src = src;
  document.getElementById("stream-placeholder").appendChild(imageElement);
};
const addPrivateRequest = (user, credits, userToken) => {
  const prettyModal = document.createElement("div");
  prettyModal.setAttribute("id", "alert-popup");
  prettyModal.classList.add("DuKSh");
  prettyModal.classList.add("EJVsl");
  prettyModal.classList.add("OtrSK");
  prettyModal.classList.add("cNGwx");
  prettyModal.classList.add("gsCWf");
  prettyModal.style.backgroundColor = "rgba(0, 170, 255, 0.58)";
  prettyModal.innerHTML = `
   <div class="GodhZ gsCWf EJVsl OtrSK CzomY">
                <div class="ExGby HruDj">
                    <div class="tSrNa gsCWf EJVsl zsSLy">
                        <h1 class="USKIn">Private Request</h1>
                        <div class="wcrwV gsCWf EJVsl">
                            <div class="AYaOY TNIio UYvZu gsCWf EJVsl OtrSK DeYlt">
                                <svg onclick="deletePrettyModal()"                                
                                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="TImJU">
                      <p>${user} requested a private stream.</p>
                      <p>They have ${credits} credits.</p>
                      <br>
                      <br>
                      <div style="display:flex;">
                          <button class="AYaOY" onclick="openPrivateRequest('${userToken}','${credits}','${user}')">Join Private</button>
                          <button style="margin-left:10px;" onclick="declinePrivateRequest('${userToken}')" class="AYaOY">Decline</button>
                      </div>
                    </div>
                </div>
            </div>
  `;
  document.body.appendChild(prettyModal);
  console.log(user, credits);
};
const updateTipRelatedUI = async () => {
  const tips = await get_donations(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id
  );
  total_donations = 0;
  let highest_tipper = "";
  let highest_tip = 0;
  let recent_tipper = tips[0].name.S;
  tips.forEach(tip => {
    total_donations += parseFloat(tip.donation.S);
    if (parseFloat(tip.donation.S) > highest_tip) {
      highest_tipper = tip.name.S;
      highest_tip = parseFloat(tip.donation.S);
    }
  });
  document.getElementById("latest-tipper-name-span").innerText =
    "Latest tipper: " + recent_tipper;
  document.getElementById("highest-tipper-name-span").innerText =
    "Highest tipper: " + highest_tipper;

  document.getElementById("tip-stat").innerText = `Tips: ${total_donations}$`;
  console.log({ total_donations });
  console.log({ tips });
  renderGoals();
};
const declinePrivateRequest = async userToken => {
  deletePrettyModal();
  console.log({ userToken });

  // event.srcElement.disabled = true;

  await send_event_with_attributes(
    region, // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    channel_id,
    "invite-declined",
    {
      userToken: userToken,
    }
  );
};
const showPrettyModal = (title, content) => {
  const prettyModal = document.createElement("div");
  prettyModal.setAttribute("id", "alert-popup");
  prettyModal.classList.add("DuKSh");
  prettyModal.classList.add("EJVsl");
  prettyModal.classList.add("OtrSK");
  prettyModal.classList.add("cNGwx");
  prettyModal.classList.add("gsCWf");
  prettyModal.style.backgroundColor = "rgba(0, 170, 255, 0.58)";
  prettyModal.innerHTML = `
   <div class="GodhZ gsCWf EJVsl OtrSK CzomY">
                <div class="ExGby HruDj">
                    <div class="tSrNa gsCWf EJVsl zsSLy">
                        <h1 class="USKIn">${title}</h1>
                        <div class="wcrwV gsCWf EJVsl">
                            <div class="AYaOY TNIio UYvZu gsCWf EJVsl OtrSK DeYlt">
                                <svg onclick="deletePrettyModal()"                                
                                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="TImJU">
                        <p>${content}</p>
                        <br>
                        <br>
                        <button
                        onclick="deletePrettyModal()"
                        class="AYaOY">OK</button>
                    </div>
                </div>
            </div>
  `;
  document.getElementsByClassName("wrapper")[0].append(prettyModal);
};
const openPrivateRequest = async (userToken, credits, user) => {
  deletePrettyModal();
  // document.getElementById("pauseChatButton").innerText = "loading...";
  const response = await send_event(
    region, // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    channel_id,
    "private-channel-start"
  );
  // document.getElementById("preview").style.display = "none";
  // insertImage("./assets/private.png");
  await pause_continue_channel(
    region, // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    channel_id,
    "private"
  );
  console.log({
    response,
  });
  // document.getElementById("pauseChatButton").innerText = "Continue Stream";
  document.getElementById("sendButton").disabled = true;
  document.getElementById("streamType-stat").innerText = `Stream Type: PRIVATE`;
  await send_event_with_attributes(
    region, // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    channel_id,
    "invite-accepted",
    {
      userToken: userToken,
      privateChannelLink: channel_id_private,
      credits: credits,
    }
  );
  priavteSecondsRemaining = (credits * 30) / privateStreamPrice;
  console.log(privateStreamPrice);
  showPrivateChatModal((credits * 30) / privateStreamPrice);
  document.getElementById("messages").style.display = "none";
  document.getElementById("privateMessages").style.display = "flex";
  document.getElementById("black-container").style.display = "none";
  document.getElementById("private-black-container").style.display = "flex";
  document.getElementById("inputContainer").style.display = "none";
  document.getElementById("privateInputContainer").style.display = "flex";
  showPrettyModal("SUCCESS", "You are now in private stream!");
  document.getElementById("views-stat").innerText = `${user} watching`;
};
const createMessage = text => {
  const newElement = document.createElement("div");
  newElement.classList.add("message");
  newElement.classList.add("message-right");
  newElement.innerHTML = `
  <div class="img-container">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
        alt=""
      />
    </div>
    <div class="text-container">
      <div class="message-info">
        <span class="name">You</span>
        <span class="time">3:50 PM</span>
      </div>
      <p class="text">${text}</p>
    </div>
  `;
  document.getElementsByClassName("message-container")[0].prepend(newElement);
};
const createOwnMessage = text => {
  const newElement = document.createElement("div");
  newElement.classList.add("message");
  newElement.classList.add("message-left");
  newElement.innerHTML = `
  <div class="img-container">
    <img
      src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      alt=""
    />
  </div>
  <div class="text-container">
    <div class="message-info">
      <span class="name">Sri Veronica</span>
      <span class="time">3:50 PM</span>
    </div>
    <p class="text">
     ${text}
    </p>
  </div>
  `;
  document.getElementsByClassName("message-container")[0].prepend(newElement);
};
// -----
const sendFunction = async () => {
  let message = document.getElementById("input-message").value;
  if (message == "") return;
  document.getElementById("input-message").value = "";
  createOwnMessage(message);
  send_message(channelConnection, message);
  const db_response = await db_put_item(
    region, // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    "oliverdb",
    `Streamer: ${message}`
  );
  console.log({ db_response });
  // }
};
// -----
const endChat = async () => {
  document.getElementById("views-stat").innerText = `0 watching`;
  document.getElementsByClassName("viewers-count")[0].innerText = `0 watching`;
  clearInterval(updateViewerInterval);
  // document.getElementById("viewsSection").style.display = "none";
  channelConnection.close();
  channelConnection.removeEventListener("open", socketEventListener);
  // document.getElementById("endChatButton").innerText = "Ending...";
  document.getElementById("endChatButton").disabled = true;
  // document.getElementById("goalsButton").disabled = true;
  document.getElementById("sendButton").disabled = true;
  document.getElementById("pausebutton").disabled = true;
  // document.getElementById("sendNotificationButton").disabled = true;
  // document.getElementById("manageTagsButton").disabled = true;
  const erase_response = await erase_all_messages(
    region,
    secretAccessKey,
    secretAccessId,
    "oliverdb"
  );
  await stopBroadcast();
  const response = await send_event(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id,
    "delete-channel"
  );
  await delete_channel(region, secretAccessKey, secretAccessId, channel_id);
  document.getElementById("preview").style.display = "none";
  // document.getElementsByClassName("message-container")[0].innerHTML = "";
  goals = [];
  // document.getElementById("tagsList").innerHTML = "";
  insertImage("./assets/offline.jpeg");
  showPrettyModal("SUCCESS", "Stream Ended!");
  // document.getElementById(
  //   "streamStatus"
  // ).innerHTML = `<h4>Stream Status: OFFLINE</h4>`;

  // const disabledHeading = document.createElement("h2");
  // disabledHeading.innerText = "Stream Ended";
  // document.getElementById("messageBox").appendChild(disabledHeading);
  // document.getElementById("endChatButton").innerText = "End Chat";
  // document.getElementById("messageBox").style.visibility = "hidden";
  // addRestartStreamControls();
  console.log({
    response,
  });
};
const removeExistingTags = async () => {
  let roomDetails = await get_stream_channel(
    region,
    secretAccessKey,
    secretAccessId,
    streamArn
  );
  roomDetails = roomDetails.channel;
  for (let key in roomDetails.tags) {
    if (roomDetails.tags[key] == "tag") {
      // insertSingleTag(key);
      if (!selectedTags.includes(key)) {
        removeChannelTag(
          region,
          secretAccessKey,
          secretAccessId,
          streamArn,
          key
        );
        console.log("removed tag", key);
      }
    }
  }
};
const createChannel = async () => {
  // document.getElementById("preview").remove();
  // document.getElementById("preview-container").innerHTML =
  //   '<canvas style="width:100%;" id="preview"></canvas>';
  // const previewEl = document.getElementById("preview");
  // window.client.attachPreview(previewEl);
  // document.getElementById("preview").style.display = "block";
  if (document.getElementById("statusImage")) {
    document.getElementById("statusImage").remove();
  }
  document.getElementById("start").innerText = "STARTING...";
  document.getElementById("start").disabled = true;
  document.getElementById("start").style.backgroundColor = "gray";
  const videoSelectEl = document.getElementById("video-devices");
  const audioSelectEl = document.getElementById("audio-devices");
  console.log(videoSelectEl.value, audioSelectEl.value);
  if (
    videoSelectEl.value == "Choose Option" ||
    audioSelectEl.value == "Choose Option" ||
    audioSelectEl.value == "None"
  ) {
    showPrettyModal("Error", "Please select a video and audio device");

    document.getElementById("start").innerText = "Start Broadcast";
    document.getElementById("start").disabled = false;
    document.getElementById("start").style.backgroundColor = "#3b71ca";
    return;
  }
  const start = document.getElementById("start");
  start.disabled = true;
  try {
    erase_all_messages(region, secretAccessKey, secretAccessId, "oliverdb");
  } catch (x) {
    console.log({ "Error In Deleting Past Messages": x });
  }
  console.log({ region, secretAccessKey, secretAccessId, channel_id });
  try {
    delete_streamer_donations(
      region,
      secretAccessKey,
      secretAccessId,
      channel_id
    );
  } catch (x) {
    console.log({ "Error In Deleting Past Donations": x });
  }
  const channel_details = await get_room(
    region, // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    channel_id
  );
  streamArn = channel_details.tags["streamArn"];
  privateStreamArn = channel_details.tags["privateStreamArn"];
  console.log({ channel_details });
  let roomDetails = await get_stream_channel(
    region,
    secretAccessKey,
    secretAccessId,
    streamArn
  );
  roomDetails = roomDetails.channel;
  privateStreamPrice = channel_details.tags["private-cost"];
  roomRules = channel_details.tags["room-rules"] || "";
  roomRules = roomRules.replace(/= @ _ \/ -/g, "\n");

  privateStreamViewPrice = channel_details.tags["private-view-cost"];
  channel_description = channel_details.tags["description"] || "";
  document.getElementById("channel-description-text").innerText =
    channel_description;
  for (let key in roomDetails.tags) {
    if (roomDetails.tags[key] == "tag") {
      // insertSingleTag(key);
      removeChannelTag(region, secretAccessKey, secretAccessId, streamArn, key);
      console.log("removed tag", key);
    }
  }
  if (
    channel_details.tags["status"] == "paused" ||
    channel_details.tags["status"] == "private"
  ) {
    pause_continue_channel(
      region,
      secretAccessKey,
      secretAccessId,
      channel_id,
      "not-paused"
    );
  }
  const { name } = channel_details;
  // document.getElementById("room-rules").innerHTML =
  //   "<h4 style='margin:0;'>Room Rules</h4>";
  document.getElementById("room-rules").innerHTML = roomRules;
  console.log({ name });
  document.getElementsByClassName("stream-title")[0].innerText = name;
  try {
    await startBroadcast();
  } catch (err) {
    console.log({ err });
    return;
  }
  // createMessage("Stream Started.");
  document.getElementById("preview").remove();
  document.getElementById("preview-container").innerHTML =
    '<canvas style="width:100%;" id="preview"></canvas>';
  const previewEl = document.getElementById("preview");
  window.client.attachPreview(previewEl);
  document.getElementById("preview").style.display = "block";
  const health = await window.client.getConnectionState();

  console.log({ health });
  setTimeout(() => {
    send_event(
      region,
      secretAccessKey,
      secretAccessId,
      channel_id,
      "stream-start"
    );
  }, 3000);
  const restartDiv = document.getElementById("restartChannelDiv");
  if (restartDiv) {
    restartDiv.remove();
  }
  // document.getElementById(
  //   "streamStatus"
  // ).innerHTML = `<h4>Stream Status: Active (People Can Watch And Send Messages In Chat.)</h4>`;
  // document.getElementById("createChannelDiv").style.display = "none";
  deletePrettyModal();
  await activate_stream(region, secretAccessKey, secretAccessId, channel_id);

  const { connection, chatClientToken, userId } = await open_channel(
    channel_id,
    "Streamer",
    region,
    secretAccessKey,
    secretAccessId
  );
  messageUserId = userId;

  channelConnection = connection;
  ClientToken = chatClientToken;

  channelConnection.addEventListener("open", socketEventListener);
};
const socketEventListener = () => {
  // document.getElementById("tagContainer").style.display = "block";
  document.getElementById("endChatButton").disabled = false;
  // document.getElementById("editPrivateStreamPriceButton").disabled = false;
  document.getElementById("sendButton").disabled = false;
  document.getElementById("pausebutton").disabled = false;
  // document.getElementById("goalsButton").disabled = false;
  // document.getElementById("sendNotificationButton").disabled = false;
  // document.getElementById("manageTagsButton").disabled = false;

  updateViewerInterval = setInterval(() => {
    get_stream_information(region, secretAccessKey, secretAccessId, streamArn)
      .then(response => {
        // console.log({ ViewerCount: response.stream.viewerCount });
        document.getElementsByClassName(
          "viewers-count"
        )[0].innerText = `${response.stream.viewerCount} watching`;
        document.getElementById(
          "views-stat"
        ).innerText = `${response.stream.viewerCount} watching`;
        document.getElementById(
          "health-stat"
        ).innerText = `Stream Health: ${response.stream.health}`;
        // document.getElementById(
        //   "viewer-count"
        // ).innerHTML = `<p>Viewer Count (EXPERIMENTAL): ${response.stream.viewerCount}</p>`;
        // console.log({ "Stream Health": response.stream.health });
        // console.log({ state: response.stream.state });
      })
      .catch(err => {
        console.log({ err });
        document.getElementsByClassName(
          "viewers-count"
        )[0].innerText = `0 watching`;
      });
  }, 2000);
  // document.getElementById("viewsSection").style.display = "block";
  channelConnection.onmessage = async event => {
    // get_stream_information(
    //   region,
    //   secretAccessKey,
    //   secretAccessId,
    //   "arn:aws:ivs:us-east-1:349111225541:channel/mIYulpjaoUXZ"
    // ).then(response => console.log({ streamInfo: response.stream }));
    const data = JSON.parse(event.data);
    console.log({ data });
    // if (data.Type == "EVENT") {
    //   createMessage(`NOTIFICATION:: ${data.EventName}`);
    // }
    if (data.Type == "EVENT" && data.Attributes?.type == "notification") {
      alert(`NOTIFICATION:: ${data.EventName}`);
    }
    if (data.Type == "EVENT" && data.EventName == "room-rules-update") {
      handleRoomRulesUpdate(data.Attributes["room-rules"]);
    }
    if (data.Type == "EVENT" && data.EventName == "goals-updated") {
      renderGoals();
      createMessage("|| Goals Updated By Streamer ||");
    }
    if (data.Type == "EVENT" && data.EventName == "tip-event") {
      createMessage(data.Attributes["tipMessage"]);
      showToast("Tip", data.Attributes["tipMessage"], "success");
      updateTipRelatedUI();
    }
    if (data.Type == "EVENT" && data.EventName == "playback-request") {
      console.log("playback-request received");
      await send_event(
        region,
        secretAccessKey,
        secretAccessId,
        channel_id,
        "playback-accepted"
      );
    }
    if (data.Type == "MESSAGE") {
      if (data.Sender.UserId != messageUserId) {
        //`${data.Sender.Attributes.displayName}:
        createMessage(` ${data.Content}`);
      }
    } else if (
      data.Type == "EVENT" &&
      data.EventName == "request-private-chat"
    ) {
      // alert("Private Chat Requested By Viewer");
      addPrivateRequest(
        data.Attributes.userName,
        data.Attributes.credits,
        data.Attributes.userToken
      );
      privateRequests.push(data);
      console.log({ request: data });
    }
  };
};
function setError(message) {
  if (Array.isArray(message)) {
    message = message.join("<br/>");
  }
  alert(message);
  // const errorEl = document.getElementById("error");
  // errorEl.innerHTML = message;
}
const handleRoomRulesUpdate = rules => {
  roomRules = rules;
  let roomRulesEscaped = roomRules.replace(/= @ _ \/ -/g, "<br>");
  document.getElementById(
    "room-rules"
  ).innerHTML = `<p style='margin:0;font-size:16px;'>${roomRulesEscaped}</p>`;
};
async function handleVideoDeviceSelect() {
  console.log("handleVideoDeviceSelect");
  const id = "camera";
  const videoSelectEl = document.getElementById("video-devices");
  const { videoDevices: devices } = await getDevices();
  if (window.client.getVideoInputDevice(id)) {
    window.client.removeVideoInputDevice(id);
  }

  // Get the option's video
  const selectedDevice = devices.find(
    device => device.deviceId === videoSelectEl.value
  );
  const deviceId = selectedDevice ? selectedDevice.deviceId : null;
  const { width, height } = config.streamConfig.maxResolution;
  // console.log({ config });
  // console.log({ width, height );
  const cameraStream = await getCamera(deviceId, width, height);

  // Add the camera to the top
  selectedCamera = { cameraStream, id };

  // -----  TEST
  // const imageElement = document.createElement("img");
  // imageElement.src = "../assets/pause.jpeg";
  // const imagePath = "../assets/pause.jpeg";

  // Create an Image element
  // const img = new Image();
  // img.src = imagePath;
  // img.onload = function () {
  //   // Create an ImageBitmap from the Image element
  //   createImageBitmap(img).then(function (imageBitmap) {
  //     // The image is loaded and converted to an ImageBitmap
  //     // You can now use the imageBitmap variable as desired
  //     window.client.addImageSource(imageBitmap, "pauseimage", {
  //       index: 1,
  //     });
  //   });
  // };
  await window.client.addVideoInputDevice(cameraStream, "cam-1", {
    index: 0,
  });
  // await window.client.exchangeVideoDevicePositions(id, "pauseimage");
}
async function handleAudioDeviceSelect() {
  console.log("handleAudioDeviceSelect");
  const id = "microphone";
  const audioSelectEl = document.getElementById("audio-devices");
  const { audioDevices: devices } = await getDevices();
  if (window.client.getAudioInputDevice(id)) {
    window.client.removeAudioInputDevice(id);
  }
  // if (audioSelectEl.value.toLowerCase() === "none") return;
  const selectedDevice = devices.find(
    device => device.deviceId === audioSelectEl.value
  );
  // Unlike video, for audio we default to "None" instead of the first device
  if (selectedDevice) {
    const microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedDevice.deviceId,
      },
    });
    console.log({ audioDevices: devices });
    selectedMicrophone = { microphoneStream, id };
    // console.log({ microphoneStream, id });
    await window.client.addAudioInputDevice(microphoneStream, "mic-1");
  }
}
async function handleIngestEndpointChange(e) {
  handleValidationErrors(validate());

  try {
    client.config.ingestEndpoint = e.target.value;
  } catch {
    handleValidationErrors(["Incorrect Ingest Url"]);
  }
}
function handleStreamKeyChange(e) {
  handleValidationErrors(validate());
}

function handleValidationErrors(errors, doNotDisplay) {
  const start = document.getElementById("start");
  //   const stop = document.getElementById("stop");

  clearError();
  if (errors && errors.length) {
    // Display errors
    if (!doNotDisplay) {
      setError(errors);
    }

    // Disable start and stop buttons
    start.disabled = true;
    // stop.disabled = true;
    return;
  }

  start.disabled = false;
}
async function initializeStreamConfigSelect() {
  const streamConfigSelectEl = document.getElementById("stream-config");
  streamConfigSelectEl.disabled = false;

  channelConfigs.forEach(([configName], index) => {
    streamConfigSelectEl.options[index] = new Option(configName, index);
  });
}
async function handleStreamConfigSelect() {
  const streamConfigSelectEl = document.getElementById("stream-config");
  const selectedConfig = streamConfigSelectEl.value;
  config.streamConfig = channelConfigs[selectedConfig][1];

  await createClient();
}
async function getDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(d => d.kind === "videoinput");
  if (!videoDevices.length) {
    setError("No video devices found.");
  }
  const audioDevices = devices.filter(d => d.kind === "audioinput");
  if (!audioDevices.length) {
    setError("No audio devices found.");
  }

  return { videoDevices, audioDevices };
}
async function getCamera(deviceId, maxWidth, maxHeight) {
  let media;
  const videoConstraints = {
    deviceId: deviceId ? { exact: deviceId } : null,
    width: maxWidth,
    height: maxHeight,
  };
  try {
    // Let's try with max width and height constraints
    media = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: true,
    });
    // console.log("sbse pehle");
    // const videoTrack = media.getVideoTracks()[0];

    // Get the capabilities of the video track
    // const capabilities = videoTrack.getCapabilities();
    // console.log(capabilities.width, capabilities.height);
  } catch (e) {
    // console.log(e);
    // setError("Unable to get camera / Microphone");
    console.log(
      `Unable to get camera with max resolution, trying with no constraints`
    );
    // delete videoConstraints.width;
    // delete videoConstraints.height;
    // media = await navigator.mediaDevices.getUserMedia({
    //   video: videoConstraints,
    //   audio: true,
    // });
  }
  // console.log({ media });
  return media;
}
async function initializeDeviceSelect() {
  const videoSelectEl = document.getElementById("video-devices");

  videoSelectEl.disabled = false;
  const { videoDevices, audioDevices } = await getDevices();
  videoDevices.forEach((device, index) => {
    videoSelectEl.options[index] = new Option(device.label, device.deviceId);
  });

  const audioSelectEl = document.getElementById("audio-devices");

  audioSelectEl.disabled = false;
  // audioSelectEl.options[0] = new Option("None", "None");
  // remove the device with id "default" from the list
  // audioDevices.splice(
  //   audioDevices.findIndex(device => device.deviceId === "default"),
  //   1
  // );
  audioDevices.forEach((device, index) => {
    if (device.deviceId === "default") return;
    audioSelectEl.options[index] = new Option(device.label, device.deviceId);
  });
}
function validate() {
  const streamKey = document.getElementById("stream-key").innerText;
  const ingestUrl = document.getElementById("ingest-endpoint").innerText;
  const errors = [];

  if (!ingestUrl) {
    errors.push("Please provide an ingest endpoint");
  }

  if (!streamKey) {
    errors.push("Please provide a stream key");
  }

  return errors;
}
function clearError() {
  const errorEl = document.getElementById("error");
  errorEl.innerHTML = "";
}

function setError(message) {
  if (Array.isArray(message)) {
    message = message.join("<br/>");
  }
  alert(message);
  // const errorEl = document.getElementById("error");
  // errorEl.innerHTML = message;
}

function getSupportedProperty(object, key) {
  if (key in object) {
    return object[key];
  }

  return "Unsupported";
}
async function startBroadcast() {
  // const streamKeyEl = document.getElementById("stream-key");
  // const endpointEl = document.getElementById("ingest-endpoint");

  try {
    await window.client.startBroadcast(stream_key, ingest_key);
  } catch (err) {
    start.disabled = false;
    setError(err.toString());
  }
}
async function stopBroadcast() {
  try {
    await window.client.stopBroadcast();
  } catch (err) {
    console.log({ err });
  }
}
function onActiveStateChange(active) {
  const start = document.getElementById("start");
  //   const stop = document.getElementById("stop");
  const streamConfigSelectEl = document.getElementById("stream-config");
  // const inputEl = document.getElementById("stream-key");
  // inputEl.disabled = active;
  if (start) {
    start.disabled = active;
  }
  //   stop.disabled = !active;
  if (streamConfigSelectEl) {
    streamConfigSelectEl.disabled = active;
  }
}
async function createClient() {
  if (window.client) {
    window.client.delete();
  }

  window.client = window.IVSBroadcastClient.create(config);

  window.client.on(
    window.IVSBroadcastClient.BroadcastClientEvents.ACTIVE_STATE_CHANGE,
    active => {
      onActiveStateChange(active);
    }
  );

  const previewEl = document.getElementById("preview");
  window.client.attachPreview(previewEl);

  await handleVideoDeviceSelect();
  await handleAudioDeviceSelect();
}
const init = async () => {
  document.getElementById("ingest-endpoint").innerText =
    "562d3781dc12.global-contribute.live-video.net";
  document.getElementById("stream-key").innerText =
    "sk_us-east-1_2S1fpt3YXCr7_trBM0OuyIhazGXENgeXlGJE4mACmfm";
  document.getElementById("ingest-endpoint-after").innerText =
    "562d3781dc12.global-contribute.live-video.net";
  document.getElementById("stream-key-after").innerText =
    "sk_us-east-1_2S1fpt3YXCr7_trBM0OuyIhazGXENgeXlGJE4mACmfm";
  try {
    const videoSelectEl = document.getElementById("video-devices");
    const audioSelectEl = document.getElementById("audio-devices");
    const streamConfigSelectEl = document.getElementById("stream-config");
    const ingestEndpointInputEl = document.getElementById("ingest-endpoint");
    // const streamKeyInputEl = document.getElementById("stream-key");
    await initializeStreamConfigSelect();

    videoSelectEl.addEventListener("change", handleVideoDeviceSelect, true);
    audioSelectEl.addEventListener("change", handleAudioDeviceSelect, true);
    streamConfigSelectEl.addEventListener(
      "change",
      handleStreamConfigSelect,
      true
    );
    ingestEndpointInputEl.addEventListener(
      "input",
      handleIngestEndpointChange,
      true
    );
    // streamKeyInputEl.addEventListener("input", handleStreamKeyChange, true);

    // Get initial values from the text fields.  Changes to these will re-create the client.
    const selectedConfig = streamConfigSelectEl.value;
    config.streamConfig = channelConfigs[selectedConfig][1];
    config.ingestEndpoint = ingestEndpointInputEl.value;

    await createClient();

    await initializeDeviceSelect();

    handleValidationErrors(validate(), true);
    return;
  } catch (err) {
    console.log({ err });
    setError(
      "Please refresh the page or manually grant access to your microphone and camera for a seamless experience"
    );
  }
};
const updatePrivateStreamPrice = async () => {
  const newPrice = document.getElementById("private-stream-price").value;
  const newPriceView = document.getElementById(
    "private-stream-price-for-viewer"
  ).value;

  if (newPrice == "" || newPriceView == "") {
    showPrettyModal(
      "Error",
      "Stream Prices were invalid and are not affected!"
    );
    return;
  }
  if (privateStreamPrice != newPrice) {
    await update_private_stream_cost(
      region,
      secretAccessKey,
      secretAccessId,
      channel_id,
      newPrice
    );
  }
  if (privateStreamViewPrice != newPriceView) {
    await update_view_private_stream_cost(
      region,
      secretAccessKey,
      secretAccessId,
      channel_id,
      newPriceView
    );
  }
  if (
    privateStreamPrice == newPrice &&
    privateStreamViewPrice == newPriceView
  ) {
    return;
  }

  send_event_with_attributes(
    region, // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    channel_id,
    "private-price-update",
    {
      newPrice: newPrice,
      newPriceView: newPriceView,
    }
  );
  privateStreamPrice = newPrice;
  privateStreamViewPrice = newPriceView;
  createMessage("Private Prices Updated");
  showToast("Alert", "Private Prices Updated", "success");
};
const removeGoalInSettings = number => {
  document.getElementById(`goalContainer${number}`).remove();
  for (let i = number + 1; i < goalCount; i++) {
    document.getElementById(`goalContainer${i}`).id = `goalContainer${i - 1}`;
    document.getElementById(`completed${i}`).id = `completed${i - 1}`;
    document.getElementById(`${i}`).id = `${i - 1}`;
    document.getElementById(`name${i}`).id = `name${i - 1}`;
    document.getElementById(`amount${i}`).id = `amount${i - 1}`;
  }
  goalCount--;
};
const addGoalFunction = () => {
  const goalContainer = document.createElement("div");
  goalContainer.setAttribute("class", "goalContainer");
  goalContainer.setAttribute("id", `goalContainer${goalCount}`);
  goalContainer.innerHTML = `
  <input id='name${goalCount}' type="text" placeholder="Goal Name" />
  <input id='amount${goalCount}' type="number" placeholder="Goal Amount" />
  <button class='stream-buttons' style='display:none;' id='completed${goalCount}' onclick="markGoalComplete(this)">Manually Mark Complete</button>
  <button class='stream-buttons' id='${goalCount}' onclick="removeGoalInSettings(${goalCount})">Remove Goal</button>
  `;
  document.getElementById("goals").appendChild(goalContainer);
  goalCount++;
};
const renderGoals = async () => {
  const goalsFromDb = await get_goals(
    region, // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    "oliverdb"
  );
  console.log({ goalsFromDb });
  const sortedByAmount = goalsFromDb.sort((a, b) => {
    return parseInt(b.amount.N) - parseInt(a.amount.N);
  });

  // const goalContainer = document.getElementById("goals");
  // goalContainer.innerHTML = "";
  // console.log({ sortedByAmount });
  for (let i = sortedByAmount.length - 1; i >= 0; i--) {
    console.log({ tst: sortedByAmount[i] });
    if (parseInt(sortedByAmount[i].amount.N) <= total_donations) {
      if (sortedByAmount[i].completed.N == "0") {
        sortedByAmount[i].completed.N = "1";
        let newgoals = [];
        for (let j = 0; j < sortedByAmount.length; j++) {
          const name = sortedByAmount[j].name.S;
          const amount = sortedByAmount[j].amount.N;
          const completed = sortedByAmount[j].completed.N;

          newgoals.push({ name, amount, completed: completed, type: "goal" });
        }

        await update_goal(
          region,
          secretAccessKey,
          secretAccessId,
          "oliverdb",
          newgoals
        );
        console.log({ newgoals });
        goals = newgoals;
        send_event_with_attributes(
          region, // Replace with your chatroom region
          secretAccessKey, // Replace with your secret access key
          secretAccessId, // Replace with your secret key id
          channel_id,
          "goal-completed",
          {
            data: `${sortedByAmount[i].name.S} Completed`,
          }
        );
      }

      document.getElementsByClassName("progress-status")[0].innerHTML = `
        <span class="progress-percentage">Complete</span>`;
      document.getElementsByClassName("goal-description")[0].innerText =
        "Goal: " + sortedByAmount[i].name.S;
      updateProgressBar(total_donations, parseInt(sortedByAmount[i].amount.N));
      continue;
    }

    document.getElementById("progress").style.display = "block";
    if (sortedByAmount[i].completed.N == "0") {
      document.getElementsByClassName("progress-status")[0].innerHTML = `
        <span class="progress-percentage">${total_donations}
        </span>/<span class="progress-tokens">${sortedByAmount[i].amount.N}</span> Tokens`;
      document.getElementsByClassName("goal-description")[0].innerText =
        "Goal: " + sortedByAmount[i].name.S;
      updateProgressBar(total_donations, parseInt(sortedByAmount[i].amount.N));
      break;
    } else {
      document.getElementsByClassName("progress-status")[0].innerHTML = `
        <span class="progress-percentage">Complete</span>`;
      document.getElementsByClassName("goal-description")[0].innerText =
        "Goal: " + sortedByAmount[i].name.S;
      updateProgressBar(total_donations, parseInt(sortedByAmount[i].amount.N));
      break;
    }
  }
};
const areGoalsChanged = () => {
  let newGoals = [];
  for (let i = 0; i < goalCount; i++) {
    const name = document.getElementById(`name${i}`).value;
    const amount = document.getElementById(`amount${i}`).value;
    if (name == "" || amount == "") {
      continue;
    }
    const completed =
      document.getElementById(`completed${i}`).innerText == "Completed" ? 1 : 0;
    newGoals.push({ name, amount, completed: completed, type: "goal" });
  }
  console.log({ newGoals });
  console.log({ goals });
  if (newGoals.length != goals.length) {
    return true;
  }
  for (let i = 0; i < newGoals.length; i++) {
    if (newGoals[i].name != goals[i].name) {
      return true;
    }
    if (newGoals[i].amount != goals[i].amount) {
      return true;
    }
    if (newGoals[i].completed != goals[i].completed) {
      return true;
    }
  }
  return false;
};
const saveAllGoals = async () => {
  if (!areGoalsChanged()) {
    return;
  }
  goals = [];
  for (let i = 0; i < goalCount; i++) {
    const name = document.getElementById(`name${i}`).value;
    const amount = document.getElementById(`amount${i}`).value;
    if (name == "" || amount == "") {
      continue;
    }
    const completed =
      document.getElementById(`completed${i}`).innerText == "Completed" ? 1 : 0;
    goals.push({ name, amount, completed: completed, type: "goal" });
  }
  console.log({ goals });
  await update_goal(region, secretAccessKey, secretAccessId, "oliverdb", goals);
  send_event(
    region, // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    channel_id,
    "goals-updated"
  );
  createMessage("Goals Updated");
  showToast("Alert", "Goals Updated", "success");
};
const removeGoalFunction = el => {
  const index = el.id;
  goals.splice(index, 1);
  // el.parentElement.remove();
  document.getElementById("goals").innerHTML = "";
  showGoalsInSettings();
};
const markGoalComplete = el => {
  console.log("called");
  let index = el.id;
  index = index.slice(9);
  // goals[index].completed = 1;
  if (el.innerHTML == "Completed") {
    goals[index].completed = 0;
  } else {
    goals[index].completed = 1;
  }
  // el.disabled = true;
  document.getElementById("goals").innerHTML = "";
  renderGoals();
};
const addPrivateChatMinute = () => {
  timer += 60;
};
function startPrivateTimer(duration, display) {
  timer = duration;
  privateMinutesReamining = parseInt(timer / 60, 10);
  priavteSecondsRemaining = parseInt(timer % 60, 10);
  private_chat_timer_interval = setInterval(function () {
    if (isPrivateStreamHealthy && !isPrivateStreamPaused) {
      privateMinutesReamining = parseInt(timer / 60, 10);
      priavteSecondsRemaining = parseInt(timer % 60, 10);

      privateMinutesReamining =
        privateMinutesReamining < 10
          ? "0" + privateMinutesReamining
          : privateMinutesReamining;
      priavteSecondsRemaining =
        priavteSecondsRemaining < 10
          ? "0" + priavteSecondsRemaining
          : priavteSecondsRemaining;

      display.textContent =
        "Private Timer: " +
        privateMinutesReamining +
        ":" +
        priavteSecondsRemaining;
      timeElapsed++;
      console.log(timeElapsed);
      if (--timer < 0) {
        // Timer has reached zero
        priavteSecondsRemaining = 0;
        clearInterval(private_chat_timer_interval);
        // Do something when the timer ends
        setTimeout(() => {
          endPrivateChat();
        }, 1000);
        showPrettyModal(
          "Stream Ended",
          "Timer has ended, automatically ending private stream and starting public stream."
        );
      }
    }
  }, 1000); // Timer ticks every 1 second
}
const privateStreamHealthInterval = async () => {
  const indicator = document.getElementById("health-stat");
  try {
    const stream_status = await get_stream_information(
      region,
      secretAccessKey,
      secretAccessId,
      privateStreamArn
    );
    if (stream_status.stream.health == "HEALTHY") {
      isPrivateStreamHealthy = true;
      indicator.style.color = "green";
      indicator.innerText = "Stream Health: HEALTHY";
    } else {
      isPrivateStreamHealthy = false;
      indicator.style.color = "red";
      indicator.innerText = "Stream Health: UNHEALTHY";
    }
  } catch (e) {
    isPrivateStreamHealthy = false;
    indicator.style.color = "red";
    indicator.innerText = "Stream Health: UNHEALTHY";
    console.log(e);
  }
};
const handlePrivatePauseAndResume = async () => {
  if (
    document.getElementById("pause-button").innerText == "Pause For More Funds"
  ) {
    await pausePrivateStreamForFunding();
  } else {
    await resumePrivateStreamAfterFunding();
  }
};
const showPrivateChatModal = credits_to_be_spent => {
  clearInterval(updateViewerInterval);

  // document.body.appendChild(modalContainer);
  const display = document.querySelector("#private-time-remaining-display");
  timeElapsed = 0;
  startPrivateTimer(credits_to_be_spent, display);
  startPrivateStream();
  privateChatInitalize();
};
const privateChatInitalize = async () => {
  const { connection, chatClientToken } = await open_channel(
    channel_id_private,
    "Private:",
    "us-east-1", // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId // Replace with your secret key id
  );
  privateConnection = connection;
  privateConnection.addEventListener("open", privateChatSocketListener);
};
const privateChatSocketListener = () => {
  // document.getElementById("psendButton").disabled = false;
  // document.getElementById("pendChatButton").disabled = false;
  // document.getElementById("addMinute").disabled = false;
  setTimeout(() => {
    let credit_remainder = setInterval(() => {
      if (timeElapsed >= 30) {
        deduct = "1";
        timeElapsed = 0;
      }
      send_event_with_attributes(
        region,
        secretAccessKey,
        secretAccessId,
        channel_id_private,
        "remaining-credits",
        {
          minutes: privateMinutesReamining.toString(),
          seconds: priavteSecondsRemaining.toString(),
          deduct: deduct,
        }
      );
      if (priavteSecondsRemaining == 0 && privateMinutesReamining == 0) {
        clearInterval(credit_remainder);
      }
      deduct = "0";
    }, 1000);
  }, 2000);

  privateConnection.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log({ data });
    if (data.Type == "MESSAGE") {
      const newElement = document.createElement("div");
      newElement.classList.add("message");
      newElement.classList.add("message-left");
      newElement.innerHTML = `
  <div class="img-container">
    <img
      src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      alt=""
    />
  </div>
  <div class="text-container">
    <div class="message-info">
      <span class="name">Sri Veronica</span>
      <span class="time">3:50 PM</span>
    </div>
    <p class="text">
     ${data.Content}
    </p>
  </div>
  `;
      document
        .getElementsByClassName("private-message-container")[0]
        .prepend(newElement);
    }
    if (data.Type == "EVENT" && data.EventName == "delete-channel") {
      document.getElementById("psendButton").disabled = true;
      document.getElementById("pendChatButton").disabled = true;
    }
    if (data.Type == "EVENT" && data.EventName == "viewer-ended") {
      showPrettyModal(
        "Alert",
        "Viewer Left Private Stream. Click End Chat To Renew Public Stream."
      );
      // alert(
      //   "Viewer Left Private Stream. Click End Chat To Renew Public Stream."
      // );
    }
    if (data.Type == "EVENT" && data.EventName == "buy-credits") {
      timer += parseInt(data.Attributes.extraTime);
      resumePrivateStreamAfterFunding();
    }
    if (data.Type == "EVENT" && data.EventName == "more-credits-in-purchase") {
      pausePrivateStreamForFunding();
    }
  };
};
const sendPrivateFunction = () => {
  const message = document.getElementById("privateTextBox").value;
  if (message == "") return;
  document.getElementById("privateTextBox").value = "";
  send_message(privateConnection, message);
};
const endPrivateChat = async () => {
  //pendChatButton
  document.getElementById("private-time-remaining-display").innerText = "-";
  document.getElementById("views-stat").innerText = `0 watching`;
  document.getElementById("messages").style.display = "block";
  document.getElementById("black-container").style.display = "flex";
  document.getElementById("private-black-container").style.display = "none";
  document.getElementById("privateMessages").style.display = "none";
  document.getElementById("inputContainer").style.display = "flex";
  document.getElementById("privateInputContainer").style.display = "none";
  clearInterval(privateStreamHealthInterval);
  clearInterval(privateHealthCheckInterval);
  clearInterval(private_chat_timer_interval);
  isPrivateStreamHealthy = false;
  // document.getElementById("pendChatButton").innerText = "loading...";
  // document.getElementById("pendChatButton").disabled = true;
  privateConnection.close();
  privateConnection.removeEventListener("open", privateChatSocketListener);
  // const previewEl = document.getElementById("preview");
  // window.client.attachPreview(previewEl);
  // -------
  // document.getElementById("pauseChatButton").innerText = "loading...";
  var element = document.getElementById("statusImage");
  if (typeof element != "undefined" && element != null) {
    element.remove();
  }
  // document.getElementById("preview").style.display = "block";
  await pause_continue_channel(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id,
    "not-paused"
  );
  document.getElementById("streamType-stat").innerText = `Stream Type: PUBLIC`;

  // document.getElementById("pauseChatButton").innerText = "Pause Stream";
  document.getElementById("sendButton").disabled = false;
  // -------
  console.log("Stopping Private Stream");
  await window.client.stopBroadcast();
  await window.client.startBroadcast(stream_key, ingest_key);
  console.log("Close Private Chat");
  try {
    await send_event(
      "us-east-1", // Replace with your chatroom region
      secretAccessKey, // Replace with your secret access key
      secretAccessId, // Replace with your secret key id
      channel_id_private,
      "delete-channel"
    );
  } catch (err) {
    console.log({ "Closing Call Err": err });
  }
  console.log("STARTING Public Stream");
  setTimeout(() => {
    send_event(
      region,
      secretAccessKey,
      secretAccessId,
      channel_id,
      "stream-start-after-private"
    );
  }, 3000);
  console.log("DELETING Private Channel");
  await delete_channel(
    "us-east-1", // Replace with your chatroom region
    secretAccessKey, // Replace with your secret access key
    secretAccessId, // Replace with your secret key id
    channel_id_private
  );
  setInterval(updateViewerInterval, 5000);
  showPrettyModal(
    "Stream Ended",
    "Private Stream Ended. Public Stream Started."
  );
};
const addTag = async () => {
  const tagValue = document.getElementById("tagInput");
  if (tagValue.value == "") return;
  insertSingleTag(tagValue.value);
  tagValue.value = "";
};
const insertSingleTag = async tagValue => {
  const tagButton = document.createElement("button");
  tagButton.innerText = tagValue;
  tagButton.setAttribute("class", "stream-buttons");
  tagButton.onclick = async () => {
    tagButton.remove();
    await removeChannelTag(
      region,
      secretAccessKey,
      secretAccessId,
      streamArn,
      tagButton.innerText
    );
    update_tags();
  };
  document.getElementById("tagsList").appendChild(tagButton);
  await addChannelTag(
    region,
    secretAccessKey,
    secretAccessId,
    streamArn,
    tagButton.innerText
  );
  update_tags();
};
const update_tags = async () => {
  const tagsContainer = document.getElementById("tagsList").children;
  const updatedTags = {};
  for (let i = 0; i < tagsContainer.length; i++) {
    updatedTags[tagsContainer[i].innerText] = "tag";
  }
  console.log({ tagsContainer });
  send_event_with_attributes(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id,
    "updated-tags",
    {
      ...updatedTags,
    }
  );
};
const send_notification = async () => {
  const notificationText = document.getElementById("notificationText").value;
  document.getElementById("notificationText").value = "";
  const response = await send_event_with_attributes(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id,
    notificationText,
    {
      type: "notification",
    }
  );
  console.log({ response });
};
const muteAudio = () => {
  if (muted) {
    document.getElementById("audioTrackIconMute").style.display = "none";
    document.getElementById("audioTrackIconUnMute").style.display = "block";
    window.client.enableAudio();
    muted = false;
  } else {
    document.getElementById("audioTrackIconMute").style.display = "block";
    document.getElementById("audioTrackIconUnMute").style.display = "none";
    window.client.disableAudio();
    muted = true;
  }
  // const doc = document.getElementById("muteAudioButton").innerText;

  // if (doc == "Mute Microphone") {
  //   window.client.disableAudio();
  //   document.getElementById("muteAudioButton").style.backgroundColor = "red";
  //   document.getElementById("muteAudioButton").innerText = "Unmute Microphone";
  //   console.log("Audio Muted");
  // } else {
  //   window.client.enableAudio();
  //   document.getElementById("muteAudioButton").style.backgroundColor =
  //     "#3b71ca";
  //   document.getElementById("muteAudioButton").innerText = "Mute Microphone";
  //   console.log("Audio Unmuted");
  // }
};
const addRestartStreamControls = () => {
  const restartStreamButton = document.createElement("button");
  restartStreamButton.innerText = "Restart Stream";
  const createChannelDiv = document.createElement("div");
  restartStreamButton.setAttribute("class", "stream-buttons");
  restartStreamButton.setAttribute("id", "start");
  restartStreamButton.onclick = async () => {
    await createChannel();
  };
  restartStreamButton.style.fontSize = "20px";
  restartStreamButton.style.padding = "12px 20px";
  createChannelDiv.setAttribute("id", "restartChannelDiv");
  createChannelDiv.appendChild(restartStreamButton);
  document.getElementsByClassName("container")[0].appendChild(createChannelDiv);
  // document.body.appendChild(createChannelDiv);
};
const startPrivateStream = async () => {
  stopBroadcast();
  const streamKey = "sk_us-east-1_0uYJV4j99Jvi_3VC66J1GhpVMvD4jqYtHVBh8gRjGRH";
  const ingestEndpoint = "562d3781dc12.global-contribute.live-video.net";
  // const privatePreview = document.getElementById("private-preview");
  console.log("Attaching Preview");
  // window.client.attachPreview(privatePreview);
  try {
    console.log("Starting Private Stream");
    await window.client.startBroadcast(streamKey, ingestEndpoint);
  } catch (err) {
    console.log("error in starting private stream", err);
  }
  setTimeout(() => {
    privateHealthCheckInterval = setInterval(privateStreamHealthInterval, 2000);
  }, 6000);
};
const pausePrivateStreamForFunding = () => {
  document.getElementById("pause-button").disabled = true;
  const imagePath = "./assets/waiting-for-token-funding.png";
  const img = new Image();
  img.src = imagePath;
  img.onload = function () {
    createImageBitmap(img).then(function (imageBitmap) {
      client.addImageSource(imageBitmap, "vod-0", { index: 1 });
    });
  };
  client.disableAudio();
  document.getElementById("pause-button").innerText = "Resume Private Stream";
  document.getElementById("pause-button").disabled = false;
  isPrivateStreamPaused = true;
};
const resumePrivateStreamAfterFunding = () => {
  document.getElementById("pause-button").disabled = true;
  client.removeImage("vod-0");
  client.enableAudio();
  document.getElementById("pause-button").innerText = "Pause For More Funds";
  document.getElementById("pause-button").disabled = false;
  isPrivateStreamPaused = false;
};
const copyingest = () => {
  const ingestEndpoint = "562d3781dc12.global-contribute.live-video.net";
  navigator.clipboard.writeText(ingestEndpoint);
};
const copykey = () => {
  const streamKey = "sk_us-east-1_0uYJV4j99Jvi_3VC66J1GhpVMvD4jqYtHVBh8gRjGRH";
  navigator.clipboard.writeText(streamKey);
};
const saveNewName = async () => {
  if (document.getElementById("channel-rename-field").value.length < 1) {
    // alert("Please enter a valid name");
    return;
  }
  const newName = document.getElementById("channel-rename-field").value;

  if (newName == document.getElementsByClassName("stream-title")[0].innerText) {
    return;
  }
  try {
    const response = await update_channel_name(
      region,
      secretAccessKey,
      secretAccessId,
      channel_id,
      newName
    );
  } catch (err) {
    alert(err);
    return;
  }
  send_event_with_attributes(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id,
    `channel-name-update`,
    {
      name: newName,
    }
  );
  document.getElementsByClassName("stream-title")[0].innerText = newName;
  createMessage("Channel Name Updated");
  showToast("Alert", "Channel Name Updated", "success");
};
const updateTagsInDb = async () => {
  await removeExistingTags();

  let updatedTags = {};
  for (let i = 0; i < selectedTags.length; i++) {
    updatedTags[selectedTags[i]] = "tag";
  }
  send_event_with_attributes(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id,
    "updated-tags",
    {
      ...updatedTags,
    }
  );
  console.log({ selectedTags });
  for (let i = 0; i < selectedTags.length; i++) {
    addChannelTag(
      region,
      secretAccessKey,
      secretAccessId,
      streamArn,
      selectedTags[i]
    );
  }
};
const renderAvailableTags = () => {
  const availableTags = document.getElementById("available-tags");
  availableTags.innerHTML = ``;
  for (let i = 0; i < tagsList.length; i++) {
    if (!selectedTags.includes(tagsList[i])) {
      const tag = document.createElement("button");
      tag.setAttribute("class", "UJQCM");
      tag.style.marginRight = "2px";
      tag.style.marginBottom = "2px";
      tag.setAttribute("id", tagsList[i]);
      tag.innerText = tagsList[i];
      tag.onclick = () => {
        selectedTags.push(tagsList[i]);
        var index = tagsList.indexOf(tagsList[i]);
        if (index !== -1) {
          tagsList.splice(index, 1);
        }
        tag.remove();
        renderSelectedTags();
        renderAvailableTags();
      };
      availableTags.appendChild(tag);
    }
  }
};
const renderSelectedTags = () => {
  const SelctedTagsMarkup = document.getElementById("selected-tags");
  SelctedTagsMarkup.innerHTML = ``;
  for (let i = 0; i < selectedTags.length; i++) {
    const tag = document.createElement("button");
    tag.setAttribute("class", "UJQCM");
    tag.style.marginRight = "2px";
    tag.style.marginBottom = "2px";
    tag.setAttribute("id", selectedTags[i]);
    tag.innerText = selectedTags[i];
    tag.onclick = () => {
      tagsList.push(selectedTags[i]);
      var index = selectedTags.indexOf(selectedTags[i]);
      if (index !== -1) {
        selectedTags.splice(index, 1);
      }
      tag.remove();
      renderAvailableTags();
      renderSelectedTags();
    };
    SelctedTagsMarkup.appendChild(tag);
  }
};
const showGoalsInSettings = () => {
  goalCount = 0;
  let sortedGoals = goals.sort((a, b) => {
    return a.amount - b.amount;
  });
  sortedGoals.forEach(goal => {
    console.log({ goal, goalCount });
    const goalContainer = document.createElement("div");
    goalContainer.setAttribute("class", "goalContainer");
    goalContainer.innerHTML = `
  <input id='name${goalCount}' type="text" placeholder="Goal Name"s/>
  <input id='amount${goalCount}' type="number" placeholder="Goal Amount" />
  <button class='stream-buttons' id='${goalCount}' onclick="removeGoalFunction(this)">Delete</button>
  <button class='stream-buttons' id='completed${goalCount}' onclick="markGoalComplete(this)">${
      parseInt(goal.completed) ? "Completed" : "Manually Mark Complete"
    }</button>
  `;
    document.getElementById("goals").appendChild(goalContainer);
    document
      .getElementById(`name${goalCount}`)
      .setAttribute("value", `${goal.name}`);
    document
      .getElementById(`amount${goalCount}`)
      .setAttribute("value", `${goal.amount}`);

    goalCount++;
  });
};
const showDeviceSelectModal = () => {
  const prettyModal = document.createElement("div");
  prettyModal.setAttribute("id", "alert-popup");
  prettyModal.classList.add("DuKSh");
  prettyModal.classList.add("EJVsl");
  prettyModal.classList.add("OtrSK");
  prettyModal.classList.add("cNGwx");
  prettyModal.classList.add("gsCWf");
  prettyModal.style.backgroundColor = "rgba(0, 170, 255, 0.58)";
  prettyModal.innerHTML = `
   <div class="GodhZ gsCWf EJVsl OtrSK CzomY">
                <div class="ExGby HruDj">
                    <div class="tSrNa gsCWf EJVsl zsSLy">
                        <h1 class="USKIn">Broadcast Stream</h1>
                        <div class="wcrwV gsCWf EJVsl">
                            <div class="AYaOY TNIio UYvZu gsCWf EJVsl OtrSK DeYlt">
                                <svg onclick="deletePrettyModal()"                                
                                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="TImJU">
                    <div style="
                        display: flex;
                        justify-content: center;
                    ">
                    <canvas id="preview" style="
                        width: 300px;
                        height: 300PX;
                        OBJECT-FIT: cover;
                        border-radius: 10px;
                    "></canvas>
                    </div>
                    
                    <section class="container">
                    <h3 id="error"></h3>
                  </section>
                        <div id="createChannelDiv">
      <br />
      <section class="container">
        <label for="video-devices">Select Webcam</label>
        <select disabled id="video-devices">
          <option selected disabled>Choose Option</option>
        </select>
        <label for="audio-devices">Select Microphone</label>
        <select disabled id="audio-devices">
          <option selected disabled>Choose Option</option>
        </select>
        <label for="stream-config">Select Channel Config</label>
        <select disabled id="stream-config">
          <option selected disabled>Choose Option</option>
        </select>
      </section>
      <br />

      <section class="container">
        <!-- <label for="ingest-endpoint">Ingest Endpoint</label> -->
        <p style="display: inline; font-weight: bold">Your Ingest Endpoint:</p>
        <p style="display: inline; user-select: all" id="ingest-endpoint"></p>
        
      </section>
      <section class="container">
        <!-- <label for="stream-key">Stream Key</label> -->
        <p style="display: inline; font-weight: bold">Your Stream Key:</p>
        <p style="display: inline; user-select: all" id="stream-key"></p>
        
      </section>
      <br />

      <section class="container">
        <button
          class="button-style"
          id="start"
          disabled
          onclick="createChannel()"
        >
          Start Broadcast
        </button>
      </section>
      <section class="container">
        <table id="data">
          <tbody></tbody>
        </table>
      </section>
    </div>
                        
                    </div>
                </div>
            </div>
  `;
  document.getElementsByClassName("wrapper")[0].append(prettyModal);
};
const deletePrettyModal = () => {
  if (document.getElementById("alert-popup")) {
    document.getElementById("alert-popup").remove();
  }
};
const deleteScrollModal = () => {
  if (document.getElementById("scroll-popup")) {
    document.getElementById("scroll-popup").remove();
  }
};
const escapeNewlines = str => {
  return str.replace(/\n/g, "= @ _ / -");
};
const updateRoomRules = () => {
  let oldRoomRules = roomRules.replace(/= @ _ \/ -/g, "\n");
  console.log({
    oldRoomRules,
    newRoomRules: document.getElementById("roomRulesInput").value,
  });
  if (oldRoomRules == document.getElementById("roomRulesInput").value) {
    return;
  }
  const roomRulesInput = document.getElementById("roomRulesInput");
  roomRules = roomRulesInput.value;
  console.log(roomRules);
  const escapedRoomRules = escapeNewlines(roomRules);
  update_room_rules(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id,
    escapedRoomRules
  );
  createMessage("Room Rules Updated");
  showToast("Alert", "Room Rules Updated", "success");
};
const updateChannelDescription = () => {
  const channelDescription = document.getElementById("channel-description");
  if (channel_description == channelDescription.value) {
    return;
  }
  update_channel_description(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id,
    channelDescription.value
  );
  document.getElementById("channel-description-text").innerText =
    channelDescription.value;
  send_event_with_attributes(
    region,
    secretAccessKey,
    secretAccessId,
    channel_id,
    "channel-description-update",
    {
      description: channelDescription.value,
    }
  );
  createMessage("Channel Description Updated");
  showToast("Alert", "Channel Description Updated", "success");
};
const saveSettings = async () => {
  try {
    await Promise.all([
      saveNewName(),
      updatePrivateStreamPrice(),
      updateRoomRules(),
      saveAllGoals(),
      updateTagsInDb(),
      updateChannelDescription(),
    ]);
  } catch (err) {
    console.log({ err });
  }
  deleteScrollModal();
};
const settingsModal = () => {
  let temporaryRoomRules = roomRules.replace(/= @ _ \/ -/g, "&#13;&#10;");
  const prettyModal = document.createElement("div");
  prettyModal.setAttribute("id", "scroll-popup");
  prettyModal.classList.add("DuKSh");
  prettyModal.classList.add("EJVsl");
  prettyModal.classList.add("OtrSK");
  prettyModal.classList.add("cNGwx");
  prettyModal.classList.add("gsCWf");
  prettyModal.style.backgroundColor = "rgba(0, 170, 255, 0.58)";
  prettyModal.innerHTML = `<div class="GodhZ gsCWf EJVsl OtrSK CzomY">
  <!-- container -->
  <div class="ExGby HruDj">
      <!-- header -->
      <div class="tSrNa gsCWf EJVsl zsSLy">
          <h1 class="USKIn">Settings</h1>

          <!-- buttons -->
          <div class="wcrwV gsCWf EJVsl">
              <div class="AYaOY TNIio UYvZu gsCWf EJVsl OtrSK DeYlt">
                  <svg onclick="deleteScrollModal()" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g>
                          <path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      </g>
                  </svg>
              </div>
          </div>
      </div>

      <!-- main-section -->
      <div class="TImJU">
          <!-- elements-container -->

          <div data-simplebar="init" class="elements-container simplebar-scrollable-y"><div class="simplebar-wrapper" style="margin: 0px -11px 0px 0px;"><div class="simplebar-height-auto-observer-wrapper"><div class="simplebar-height-auto-observer"></div></div><div class="simplebar-mask"><div class="simplebar-offset" style="right: 0px; bottom: 0px;"><div class="simplebar-content-wrapper" tabindex="0" role="region" aria-label="scrollable content" style="height: auto; overflow: hidden scroll;"><div class="simplebar-content" style="padding: 0px 11px 0px 0px;">
          <div><h2
          style="font-size: 18px;"
          >Edit Channel Name</h2>
          <input id="channel-rename-field" value="${
            document.getElementsByClassName("stream-title")[0].innerText
          }"/>
          </div>

          <div>
          <h2 style="font-size: 18px;">Set Private Stream Costs (Per 30 Seconds)</h2>
          <div style="display:flex;">
            <input id='private-stream-price' type='number' value='${parseInt(
              privateStreamPrice
            )}'/>
            
            </div>
            <h2 style="font-size: 18px;">Set Private Stream Costs For Viewer (Per 30 Seconds)</h2>
          <div style="display:flex;">
            <input id='private-stream-price-for-viewer' type='number' value='${parseInt(
              privateStreamViewPrice
            )}'/>
            </div>

        </div>

        <div>
          <h2 style="font-size: 18px;">Edit Room Rules</h2>
          <textarea id="roomRulesInput">${temporaryRoomRules}</textarea>
        </div>
        
        <div>
        <h2 style="font-size: 18px;">Channel Description</h2>
          <input id="channel-description" placeholder="Channel Description..." value="${channel_description}" />
        </div>

        <div>
          <h2 style="font-size: 18px;">Stream Goals</h2>
          <p>INFO: Goals are automatically sorted by amount and shown to the viewers. After changing, click save button for changes to take effect.</p>
          <div id="goals"></div>
          <button class='stream-buttons' onclick="addGoalFunction()">Add A Goal</button>
        </div>


      <div>
        <h2 style="font-size: 18px;">Add & Remove Tags</h2>
        <h3 style="font-size: 16px;">Available Tags</h3>
        <div id="available-tags" style="display:flex;flex-wrap:wrap;"></div>
        <h3 style="font-size: 16px;">Selected Tags</h3>
        <div id="selected-tags" style="display:flex;flex-wrap:wrap;"></div>
      </div>
      <hr/>
      


              
          </div></div></div></div><div class="simplebar-placeholder" style="width: 671px; height: 1522px;"></div></div><div class="simplebar-track simplebar-horizontal" style="visibility: hidden;"><div class="simplebar-scrollbar" style="width: 0px; display: none;"></div></div><div class="simplebar-track simplebar-vertical" style="visibility: visible;"><div class="simplebar-scrollbar" style="height: 145px; display: block; transform: translate3d(0px, 325px, 0px);"></div></div></div>
          <div style="display:flex;">
        <button class="AYaOY" onclick="saveSettings()">Save</button>
        <button style="margin-left:10px;" onclick="deleteScrollModal()" class="AYaOY">Cancel</button>
      </div>
      </div>
  </div>
</div>
  `;
  document.body.appendChild(prettyModal);
  // document.getElementsByClassName("wrapper")[0].append(prettyModal);
  showGoalsInSettings();
  renderAvailableTags();
  renderSelectedTags();
};

showDeviceSelectModal();
init();

// <div class="TImJU">
