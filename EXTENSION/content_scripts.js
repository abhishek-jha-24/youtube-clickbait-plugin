let params;
let prevVideoID;
let videolD;

console.log("started");

let refreshParams = () => {
let urlSearchParams = new URLSearchParams(window.location.search);
params = Object.fromEntries(urlSearchParams.entries());
    videolD = window.location.pathname == "/watch" ?? params.v;
} ;
let performCheck = () => {
console.log('Video ID: ${videoID}');
};

let getdetails = async (m, n, k) => {

const a = await fetch('http://127.0.0.1:5000/getRating/'+n)
 .then((response) => {
   return response.json();
 })
 .then((myJson) => {

        
           if ((m.nextSibling.childNodes.length != 0 && !k) || (k && m.nextSibling.childNodes.length > 1)){
            return 1;
           }
            var fragment = "<span class='style-scope ytd-badge-supported-renderer' style='color:green;font-weight:bolder;border-radius: 3px;'>Ad</span>";
                fragment.innerText = "00";
                fragment.innerHTML = "00";
                m.insertAdjacentHTML("afterend", fragment );
                var x = "Rating:";
               
                var y = 100 - myJson*100;
                y = Math.round(100*y)/100;

                var l;
                const emotions = ["😆","😀", "🙂", "😐", "😡"];
                if (y >= 90){
                l=emotions[0];
                } else if(y >= 75){
                l=emotions[1];
                } else if(y >= 60){
                l=emotions[2];
                } else if(y >= 40){
                l=emotions[3];
                } else{
                l=emotions[4];
                }
                if (y >= 40){
                    y = Math.min(y+10, 100);
                }
                var z =y +"%" + l;
                m.nextSibling.innerHTML=z;
                if (y < 40){
                    var clickbait = "<span class='style-scope ytd-badge-supported-renderer' style='color:white;background-color: #bf0404;border:2px black;font-weight:bolder;border-radius: 3px;padding:0 4px;'>clickbait</span>";
                    m.nextSibling.insertAdjacentHTML("afterend", clickbait);
                }
                console.log("completed for ", n);
 
    return myJson.data;
  });

return a;
}

function checkArrays( arrA, arrB ){
    //check if lengths are different
    if(arrA.length !== arrB.length) return false;
    //slice so we do not effect the original
    //sort makes sure they are in order
    //join makes it a string so we can do a string compare
    var cA = arrA.slice().sort().join(",");
    var cB = arrB.slice().sort().join(",");
    return cA===cB;
}
curr = document.location.href.slice(24, 31);
console.log(curr)
let last_address = document.location.href;
let lastUrl = [];
    new MutationObserver(() => {
        curr = document.location.href.slice(24, 31);
        var current_address = document.location.href;
        if (current_address != last_address){
            lastUrl = []
            console.log("changed")
        }
        console.log(curr);
        if (curr[0] == 'c'){
            var url = document.querySelectorAll("ytd-grid-video-renderer");
        }else{
            var url = document.querySelectorAll("div#meta"); 
        }
        console.log(curr, "->", url);
        if (url.length != lastUrl.length) {
            if (curr[0] == 'c'){
                var arr = document.querySelectorAll("ytd-grid-video-renderer div#dismissible div#details div#meta div div div#metadata-line span");
            }else{
                var arr = document.querySelectorAll("div#meta ytd-video-meta-block div div span");
            }

            var res = Array.from(arr).filter(function(v, i) {
            return v.innerText.slice(-3) === "ago";
        });
        for (let i = lastUrl.length; i >= 0 ; i--) {
            if (res[i].nextSibling.childNodes.length != 0){
                break;
            }
            if (curr == ""){
                var mno = res[i].parentElement.parentElement.parentElement.parentElement.firstChild.lastChild.href;
            }else{
                var mno = res[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].href;
            }
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = mno.match(regExp);
            if (match && match[2].length == 11) {
              mno = match[2];
            } else {
              //error
            }
            console.log(curr, "->", mno);
            getdetails(res[i], mno, curr[0]=='c');
        }
        for (let i = lastUrl.length; i < res.length; i++) {
            if (curr == ""){
                var mno = res[i].parentElement.parentElement.parentElement.parentElement.firstChild.lastChild.href;
            }else{
                var mno = res[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].href;
            }          
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = mno.match(regExp);
            if (match && match[2].length == 11) {
              mno = match[2];
            } else {
              //error
            }
            console.log(curr, "->", mno);
            getdetails(res[i], mno, curr[0]=='c');
        }

        lastUrl = url
        last_address = current_address
        refreshParams();
        }
    }).observe(document, { subtree: true, childList: true});
    refreshParams();
performCheck();

