// <!--
//
var fb_member_id = 0;
//
window.fbAsyncInit = function() {
    FB.init({appId:"195491160487496",
        logging:false,
        channelUrl: '//glitterwood.com/fb/channel.html',
        status:true,
        cookie:true,
        xfbml:true});
//
    FB.Event.subscribe('auth.statusChange', function (response) {
        if (response.authResponse) {
            if (response.authResponse.userID == fb_member_id) {
                console.log('fb_id = ', fb_member_id, 'auth member id = ', response.authResponse.userID, ', not reloading ');
            } else {
                console.log('fb_id = ', fb_member_id, 'auth member id = ', response.authResponse.userID, ', reloading ');
                document.location = document.location.protocol + '//' + document.location.host + '?user_changed_auth=' + Math.random();
            }
        } else {
            console.log('no auth response');
            if (fb_member_id)
                console.log('fb_id = ', fb_member_id, ', reloading ');
            document.location = document.location.protocol + '//' + document.location.host + '?user_changed_auth=' + Math.random();
        }
    });
//
}
    (function(d){
        var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        d.getElementsByTagName('head')[0].appendChild(js);
    })(document);
// -->
