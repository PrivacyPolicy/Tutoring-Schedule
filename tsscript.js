addEventListener("load", init);
addEventListener("hashchange", navToHash);
addEventListener("click", updateActive);
addEventListener("mouesmove", updateActive);
document.addEventListener("touchstart", function(event) {
	if (event.touches.length > 1) {
    	event.preventDefault();
        // disable the pinch or rotate, but keep the touch
        var avgX = 0, avgY = 0;
        for (var i = 0; i < event.touches.length; i++) {
            avgX += event.touches[i].clientX;
            avgY += event.touches[i].clientY;
        }
        avgX /= event.touches.length;
        avgY /= event.touches.length;
        document.elementFromPoint(avgX, avgY).click();
    }
});
document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

function init() {
    // event listener bonanza
    var content = document.getElementById("content");
    var pages = content.children;
    
    /*var subjBubbles = pages[0].getElementsByClassName("bubbleWrap");
    for (var i = 0; i < subjBubbles.length - 1; i++) {
            var x = subjBubbles[i].children[0].children[0];
            x.addEventListener("click", function()
                {
                    var bubbleWrap = bubbleWrapFromChild(event.target);
                    if (!bubbleWrap.classList.contains("upfront")) {
                        bubbleWrap.classList.add("upfront");
                        transitionTo("courses",
                                     getTitleForBubble(bubbleWrap));
                    }
                    
                });
        }

    var tutorBubble = subjBubbles[subjBubbles.length - 1];
    var x = tutorBubble.children[0].children[0];
    x.addEventListener("click", function()
        {
            var bubbleWrap = bubbleWrapFromChild(event.target);
            if (!bubbleWrap.classList.contains("upfront")) {
                bubbleWrap.classList.add("upfront");
                transitionTo("tutors", "Tutors");
            }

        });
    
    var corsBubbles = pages[1].getElementsByClassName("bubbleWrap");
    for (var i = 0; i < corsBubbles.length; i++) {
        var x = corsBubbles[i].children[0].children[0];
        x.addEventListener("click", function()
            {
                var bubbleWrap = bubbleWrapFromChild(event.target);
                if (!bubbleWrap.classList.contains("upfront") &&
                    document.getElementById("content").className ==
                    "courses") {
                    bubbleWrap.classList.add("upfront");
                    transitionTo("schedule",
                                 getTitleForBubble(bubbleWrap));
                }

            });
    }*/
    
    var backButtons = document.getElementsByClassName("back");
    for (var i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click", backPage);
    }
    
    var tutBubbles = pages[2].getElementsByClassName("bubbleWrap");
    for (var i = 0; i < tutBubbles.length; i++) {
        var x = tutBubbles[i].children[0].children[0];
        x.addEventListener("click", function()
            {
                if (document.getElementById("content").className ==
                    "tutors" && !document.getElementById("tutorList"
                        ).classList.contains("hide")) {
                    var bubble = bubbleWrapFromChild(event.target);
                    var tutorName = getTitleForBubble(bubble);
                    showTutorDetails(bubble, tutorName);
                }

            });
    }
    
    // check the # to see what page to start on
    navToHash();
    var tutList = document.getElementById("tutorList");
    tutList.scrollTop = tutList.children[0].offsetTop - .1 * innerHeight;
    
    
    // temp w/ feedback
    /*var fb = document.getElementById("feedbackDialog");
    fb.addEventListener("click",
        function() {
                    if (event.target.id != "feedbackBox") {
                        if (event.target.parentElement) {
                            if (event.target.parentElement.id != "feedbackBox") {
                                if (event.target.parentElement.parentElement) {
                                    if (event.target.parentElement.parentElement.id != "feedbackBox") {
                        fb.classList.add("hidden");
                            }}}}
                     }
        });
    var fbButton = document.getElementById("feedback");
    fbButton.addEventListener("click", function() {
        fb.classList.remove("hidden");
        });*/
}

var backToHeight = -1;
function navToHash() {
    var hash = document.location.hash;
    hash = hash.substr(1, hash.length);
    var content = document.getElementById("content");
    var pages = content.children;
    
    if (hash != "") {
    
        for (var i = 0; i < subjects.length; i++) {
            if (hash == subjects[i].name) {
                clickBubbleOnPage(0, hash);
                transitionTo("courses", hash);
                var upfronts = pages[1].getElementsByClassName("upfront");
                if (upfronts[0]) upfronts[0].classList.remove("upfront");
                return;

            } else if (hash.indexOf(subjects[i].name) > -1) {
                // a specific course, find out which one
                var upfronts = pages[1].getElementsByClassName("upfront");
                if (upfronts[0]) upfronts[0].classList.remove("upfront");

                clickBubbleOnPage(0, subjects[i].name);
                hash = decodeURI(hash).split("+").join(" ");
                clickBubbleOnPage(1, hash);
                transitionTo("schedule", hash);
                return;
            } else if (subjects[i].courses.indexOf(decodeURI(hash).split("+").join(" ")) > -1) {
                clickBubbleOnPage(0, subjects[i].name);
                hash = decodeURI(hash).split("+").join(" ");
                clickBubbleOnPage(1, hash);
                transitionTo("schedule", hash);
                return;
            }
        }
        if (hash == "Tutors") {
            clickBubbleOnPage(0, "Tutors");
            transitionTo("tutors", "Tutors");
            document.getElementById("tutorList").classList.remove("hide");
            var upfronts = pages[2].getElementsByClassName("upfront");
            if (upfronts[0]) upfronts[0].classList.remove("upfront");
            
            var tutorList = document.getElementById("tutorList");
            if (backToHeight > 0) {
                smoothScroll(tutorList, tutorList.scrollTop,
                    backToHeight);
                backToHeight = 0;
            }
            return;
        } else if (hash.indexOf("Tutor") > -1) {
            var bubbles = pages[2].getElementsByClassName("bubbleWrap");
            var bubble;
            for (var ind = 0; ind < bubbles.length; ind++) {
                if (bubbles[ind].children[0].getAttribute("href") == 
                    "#" + hash) {
                    bubble = bubbles[ind];
                    break;
                }
            }
            if (bubble) {
                var upfronts = pages[2].getElementsByClassName("upfront");
                for (var i = 0; i < upfronts.length; i++) {
                    upfronts[i].classList.remove("upfront");
                    content.className = "subjects";
                }
                clickBubbleOnPage(0, "Tutors");
                transitionTo("tutors", "Tutors");
                var tutorList = document.getElementById("tutorList");
                tutorList.classList.add("hide");
                clickBubbleOnPage(2, getTitleForBubble(bubble));
                showTutorDetails(bubble, getTitleForBubble(bubble));
            }
            return;
        }
    } else {
        var upfronts = document.getElementsByClassName("upfront");
        for (var i = 0; i < upfronts.length; i++) {
            upfronts[i].classList.remove("upfront");
            content.className = "subjects";
        }
    }
}

function clickBubbleOnPage(page, bubbleTitle) {
    var content = document.getElementById("content");
    var pages = content.children;
    var bubbles = pages[page].getElementsByClassName("bubbleWrap");
    for (var ind = 0; ind < bubbles.length; ind++) {
        if (getTitleForBubble(bubbles[ind]) == bubbleTitle) {
            bubbles[ind].classList.add("upfront");
            break;
        }
    }
}

function bubbleWrapFromChild(bubbleChild) {
    var p1 = bubbleChild.parentElement;
    var p2 = p1.parentElement;
    var p3 = p2.parentElement;
    if (p1.classList.contains("bubbleWrap")) {
        return p1;
    } else if (p2.classList.contains("bubbleWrap")) {
        return p2;
    } else if (p3.classList.contains("bubbleWrap")) {
        return p3;
    } else {
        return null;
    }
}

function transitionTo(toPageID, toPageNewName) {
    var content = document.getElementById("content");
    var prevPageID = content.className;
    var pages = content.children;
    content.className = toPageID;
    if (toPageID == pages[1].id) {
        var courses = getCoursesForSubject(toPageNewName);
        var toPageElem = document.getElementById(toPageID);
        var courseBubbles =
            toPageElem.getElementsByClassName("bubbleWrap");
        for (var i = 0; i < courses.length; i++) {
            setTitleForBubble(courseBubbles[i], courses[i]);
            setHashForBubble(courseBubbles[i], courses[i]);
        }
        var i = courses.length;
        toPageElem.className = (i == 1) ? "one" : (i == 2) ? "two" : 
            (i == 3) ? "three" : "four";
    } else if (toPageID == pages[3].id) {
        showSchedule("course", toPageNewName);
    }
    setTitle(toPageNewName);
}

function backPage() {
    var content = document.getElementById("content");
    var curPage = document.getElementById(content.className);
    var upfronts = document.getElementsByClassName("upfront");
    var prevPage = "";
    switch (curPage.id) {
        case "tutors":
            var tutorList = document.getElementById("tutorList");
            if (!tutorList.classList.contains("hide")) {
                prevPage = "subjects";
                setHash("");
            } else {
                prevPage = "tutors";
                tutorList.classList.remove("hide");
                setTitle("Tutors");
                setHash("Tutors");
            }
            break;
        case "schedule":
            prevPage = "courses";
            var newHash = upfronts[0].children[0].getAttribute("href");
            setHash(newHash);
            break;
        default:
            setHash("");
            prevPage = "subjects";
    }
    content.className = prevPage;
    if (upfronts.length > 0) {
        upfronts[upfronts.length - 1].classList.remove("upfront");
    }
}

function setTitle(newTitle) {
    var content = document.getElementById("content");
    var curPage = document.getElementById(content.className);
    curPage.children[0].innerHTML = newTitle;
}


function getCoursesForSubject(subject) {
    for (var i = 0; i < subjects.length; i++) {
        if (subjects[i].name == subject) {
            return subjects[i].courses;
        }
    }
}

function getTitleForBubble(bubbleWrap) {
    return bubbleWrap.children[0].children[0].children[0].textContent;
}
function setTitleForBubble(bubbleWrap, newTitle) {
    var theBubble = document.getElementById(bubbleWrap.id);
    var x = theBubble.children[0].children[0].children[0];
    x.innerHTML = newTitle;
}
function setHashForBubble(bubbleWrap, newHash) {
    var theBubble = document.getElementById(bubbleWrap.id);
    var a = theBubble.children[0];
    newHash = newHash.split(" ").join("+");
    a.setAttribute("href", "#" + encodeURI(newHash));
}

function setHash(newHash) {
    newHash = newHash.split(" ").join("+");
    document.location.hash = encodeURI(newHash);
}

function showSchedule(type, name) {
  var scheduleView = document.getElementById(type + "Schedule");
  var boxes = scheduleView.getElementsByClassName("boxes")[0];
  boxes.innerHTML = ""; // clear any current boxes
  if (type == "course") {
      for (var ind = 0; ind < Tutors.length; ind++) {
          if (Tutors[ind].courses.indexOf(name) != -1) {
              for (var n = 0; n < Tutors[ind].hours.length; n++) {
                  var m = Tutors[ind].hours[n].split(" ")[1].split("-");
                  setBoxPlace(Tutors[ind].hours[n][0],
                              m[0], m[1], null, boxes);
              }
          }
      }
  } else {
    for (var i = 0; i < Tutors.length; i++) {// Find tutor
        if (Tutors[i].name == name) { // then calc hours
            for (var n = 0; n < Tutors[i].hours.length; n++) {
              var m = Tutors[i].hours[n].split(" ")[1].split("-");
                var notes = "";
                var test = Tutors[i].hours[n].split(" ")[2];
                if (Tutors[i].hours[n].split(" ")[2]) {
                    notes = Tutors[i].hours[n].substr(14, 100);
                }
                setBoxPlace(Tutors[i].hours[n][0],
                            m[0], m[1], notes, boxes);
                t = Tutors[i].hours[n].split(",");
            }
            break;
        }
    }
  }
}

function setBoxPlace(dayNum, startTime, endTime, notes, boxesElem) {
    var start = (parseInt(startTime.split(":")[0]) + 2) % 12;
    var startMin = (parseInt(startTime.split(":")[1])) / 60;
    start += startMin;
    var duration=(parseInt(endTime.split(":")[0]) + 2) % 12
    - start;
    var endMin = (parseInt(endTime.split(":")[1])) / 60;
    duration += endMin;
    var day = letterDayToClassDay(dayNum);
    
    var div = document.createElement("div");
    div.classList.add("box");
    div.classList.add(day);
    div.style.top = (15*start - 5) + "%";
    div.style.height = (15 * duration) + "%";
    
    if (notes) {
        var span = document.createElement("span");
        var text = document.createTextNode(notes);
        span.appendChild(text);
        div.appendChild(span);
    }
    
    boxesElem.appendChild(div);
}

function letterDayToClassDay(letter) {
    switch (letter.toLowerCase()) {
        case "m":
            return "monday";
            break;
        case "t":
            return "tuesday";
            break;
        case "w":
            return "wednesday";
            break;
        case "r":
            return "thursday";
            break;
        case "f":
            return "friday";
            break;
        default:
            return "sunday";
    }
}

function showTutorDetails(elem, tutorName) {
    var tutList = document.getElementById("tutorList");
    tutList.classList.add("hide");
    elem.classList.add("upfront");
    var tutCourses = document.getElementById("tutorCourses");
    tutCourses.innerHTML = "";
    for (var i = 0; i < Tutors.length; i++) {// Find tutor
        if (Tutors[i].name == tutorName) { // then print courses
            var lastCourse = "";
            if (Tutors[i].courses.length > 0) {
                for (var m = 0; m < Tutors[i].courses.length; m++) {
                    var course = Tutors[i].courses.sort()[m].split(" ");
                    if (course[0] == lastCourse) {
                        tutCourses.innerHTML += ",&nbsp;" + course[1];
                    } else if (lastCourse == "") { // first time
                        tutCourses.innerHTML += course[0];
                        if (course[1]) {
                            tutCourses.innerHTML += "&nbsp;" + course[1];
                        }
                    } else { // diff course, new line
                        tutCourses.innerHTML += "&nbsp; |&nbsp; " +
                            course[0];
                        if (course[1]) {
                            tutCourses.innerHTML += "&nbsp;" + course[1];
                        }
                    }

                    if (course[0] == "Intro") {// special case
                        tutCourses.innerHTML += "&nbsp;Programming";
                        lastCourse = "Programming";
                    } else { // usual case
                        lastCourse = course[0];
                    }
                }
            } else {
                tutCourses.innerHTML = "No Courses Found";
            }
            break;
        }
    }
    backToHeight = tutList.scrollTop;
    var firstBubble = tutList.children[0];
    smoothScroll(tutList, tutList.scrollTop, 0);
    setTitle(tutorName);
    showSchedule("tutor", tutorName);
}

function smoothScroll(elem, from, to) {
    smoothScrollRecursive(elem, from, to, 0, 0);
}

const bezier = [ 1.5, 2.5, 9, 15, 22, 22, 15, 9, 2.5, 1.5 ];
const sumBezier = 100; // My calculated sum of above numbers
function smoothScrollRecursive(elem, origTop, toTop, i, sum) {
    if (i < 100) {
        var scrollBy = bezier[ Math.floor(i++ / 100 * 10) ];
        scrollBy = scrollBy / 10 * (origTop - toTop) / sumBezier;
        
        sum += scrollBy;
        //console.log( sum );
        
        elem.scrollTop = origTop - sum;

        window.setTimeout(
            function() {
                smoothScrollRecursive(elem, origTop, toTop, i, sum);
            }, 1);
    }
}

var timeoutID;
const innactiveInterval = 1000 * 60 * 5; // 5 minutes
function updateActive() {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(function() {backPage(); backPage();},
                           innactiveInterval);
}

function wander(elem) {
    if (!elem.parentElement.parentElement.classList.contains("upfront")) {
        var randY = Math.floor((Math.random() * 10 % 15));
        elem.style.top = randY + "%";
        elem.style.bottom = -randY + "%";
        window.setTimeout(function() {wander(elem);}, 1000);
    }
}