$(document).ready(function() {
  // $.get('/fullPageTmpl.html', function(data) {
  //   $('#chat-box-div').append(data);
  // });

  var $userId = $('#userId');
  var $appKey = $('#appKey');
  var $contactNumber = $('#contactNumber');
  var $password = $('#password');
  var $chat_form = $('#chat-form');
  var $chat_submit = $('#chat-submit');
  var $chat_relauncher = $('#chat-relauncher');
  var $chat_response = $('#chat-response');
  var $chat_postlaunch = $('#chat-post-launch');
   var bot_contacts = [{"userId": "stupid_snow@applozic.com", "displayName": "Stupid Snow",
                          "imageLink": "/images/stupid_snow.jpg", // image url
                          }];

  $chat_form.submit(function() {
    // if ($appKey.val() === '') {
    //   $chat_response.html(
    //       'Oops!, looks like you have not entered correct application key.');
    //   $chat_response.removeClass('hide').addClass('show');
    //   return false;
    // }
    if ($userId.val() === '') {
      $chat_response.html(
          'Oops!, looks like you have not entered correct userId.');
      $chat_response.removeClass('hide').addClass('show');
      return false;
    }
    $chat_submit.html('Launching...');
    var userId = $userId.val();
    var appKey = $appKey.val();
    var userContactNumber = $contactNumber.val();
    var userPassword = $password.val();
    var topicBoxEnabled = true;

    /*var displayName = '';
    displayName = '${param.displayName}';*/

    function onInitialize(data) {
      if (data.status == 'success') {
        // write your logic exectute after plugin initialize.
        $('#chat').css('display', 'none');
        $('#chat-box-div').css('display', 'block');
        $applozic.fn.applozic('loadContacts', {"contacts":bot_contacts});
        $applozic.fn.applozic('loadTab', "stupid_snow@applozic.com");
        sendWelcomeMessageOnFirstConversation($userId.val());
      }
    }

    $applozic.fn.applozic({
      notificationIconLink:
          'https://www.applozic.com/resources/images/applozic_icon.png',
      userId: userId,
      // appId: appKey,
      appId: '156568f01fff47efbfe9f7a6715f072c9',
      // email:'userEmail',
      accessToken: userPassword,
      desktopNotification: true,
      swNotification: true,
      olStatus: true,
      onInit: onInitialize,
      locShare: true, 
      googleApiKey: 'AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4',
      launchOnUnreadMessage: true,
      topicBox: topicBoxEnabled,
      authenticationTypeId: 1,
     // readConversation: populateWelcomeMessage
      //initAutoSuggestions : initAutoSuggestions
      // topicDetail: function(topicId) {}
    });

    

     


    function populateWelcomeMessage(userId){
    console.log("populating welcome message "+userId);
        setTimeout(function(){ 
         $.ajax({
                url: "/welcomeMessage?userId="+userId,
                type: 'get',
                contentType: 'application/json',
                success: function(result) {
                  console.log(JSON.stringify(result));
                }
                            
        }); }, 3000);

       

    };
    function sendWelcomeMessageOnFirstConversation(userId){
      console.log("checking isFirstConversation "+userId);
        $.ajax({
                url: "/isFirstConversation?userId="+userId,
                type: 'get',
                contentType: 'application/json',
                success: function(result) {
                  console.log("is new user : "+result);
                  if(result==true){
                      console.log("populating welcome message");
                    populateWelcomeMessage(userId); 
                  }
                }
                            
        });
    };
    return false;
  });
  $chat_relauncher.on('click', function() {
    sessionStorage.clear();
    window.location = '/login.html';
  });

});

