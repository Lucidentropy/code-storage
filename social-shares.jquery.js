$(function(){

    $.fn.shareClick = function(network, shareData){ // helper function to proxy the .click
        $(this).click(function(){
            $(this).share(network, shareData);
        });
    };

    $.fn.share = function( network, shareData) {
        var t = $(this);

        var loginState      = ($('script[data-signed-in]').attr('data-signed-in') != "False") ? 'loggedin' : 'loggedout';
        var base_url        = ($('script[data-base-url]').attr('data-base-url')) || '';

        if ( shareData === '' || typeof shareData === 'undefined' ) {
            console.error('[social][error] No shareData provided, cannot proceed')
            return false;
        }

        // Share Data
        var shareCopy       = shareData.copy || '';
        var shareUrl        = shareData.url || document.location.href;
        if ( shareUrl.indexOf('http') == -1 ) shareUrl = base_url + shareUrl;
        var hashTags        = shareData.hashTags || '';
        var shareImg        = (shareData.img !== '') ? base_url + shareData.img : '';
        var shareTitle      = shareData.title || ''; // facebook

        // Hashtag functions
        if ( network === 'twitter' || network === 'pinterest' ) {
            if ( network === 'twitter' )     var charLimit = 116;
            if ( network === 'pinterest' )   var charLimit = 500;
            var hashtagssplit = hashTags.trim().split(" ");
            hashtagssplit.forEach(function (e) {
                var newsharecopy = shareCopy + " " + e;
                if (newsharecopy.length <= charLimit) {
                    shareCopy += " " + e;
                }
            });
        }

        // We assume all requests must have a shareUrl
        if ( shareCopy === '' || shareUrl === '' ) {
            console.warn('[social][error] There was no shareCopy or no shareUrl.', 'shareCopy : ' + shareCopy , 'shareUrl : ' + shareUrl)
            return false;
        }

        switch(network) {
            case "facebook" :
                var data = {
                    method: 'feed',
                    link: shareUrl,
                    picture: shareImg,
                    name: shareTitle,
                    description: shareCopy
                };

                var callback = function callback(response) {
                }

                FB.ui(data, callback);
            break;
            case "twitter" :
                window.open(
                    'http://twitter.com/intent/tweet?text=' + encodeURIComponent(shareCopy) +
                    '&url=' + encodeURIComponent(shareUrl)
                );
            break;
            case "pinterest" :
                window.open(
                    'http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(shareUrl) +
                    '&media=' + encodeURIComponent(shareImg) +
                    '&description=' + encodeURIComponent(shareCopy)
                );
            break;
            default:
                console.warn('[social][error] No valid case for share network - did you provide the correct network in the .social() call?');
                return false;
        }

        // Event tracking
        t.trigger('share', network);

    }

    var fbinit = false;
    var initFB = function(){

        var facebook_id     = 'APPID' // requires an app id. Removed from code-storage for privacy.
        try{

            if(typeof(FB) != 'undefined' && FB !== null) {
                fbinit = true;
                FB.init({
                    appId      : facebook_id,
                    status     : true,
                    cookie     : true,
                    xfbml      : true
                });
            }

            (function(d) {
                var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement('script'); js.id = id; js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";
                ref.parentNode.insertBefore(js, ref);
            }(document));
        }catch(error){
            console.log("Facebook can not load at this time", error);
        }
    };

    initFB();
});
