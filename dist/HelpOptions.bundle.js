(()=>{"use strict";document.addEventListener("DOMContentLoaded",(function(){var e=[];function t(t,l){var o=document.createElement("div");o.style.display="flex",o.style.flexDirection="row",o.style.width="100%",o.id=t;var r=document.createElement("p");r.textContent=t,r.style.color="rgb(91, 47, 11",r.style.flexShrink="0";var a=document.createElement("div");a.style.flexGrow="1";var i=document.createElement("div");i.style.alignContent="center",i.style.cursor="pointer";var s=document.createElement("i");s.className="fa-solid fa-minus";var d,c,p=document.createElement("div");return p.style.width="5%",(d=i).addEventListener("click",(function(){var e=d.parentElement,t=document.getElementById("tasksContainerP");if(t)for(var l=t.children,o=0;o<l.length;o++){var r=l[o];console.log(r.textContent),r==e&&(t.removeChild(r),n(e.id))}else console.log("it is null")})),i.appendChild(s),o.appendChild(r),o.appendChild(a),o.appendChild(i),o.appendChild(p),l||(console.log("i want to push: "+t),e.push(t),c=e,localStorage.setItem("tasks",JSON.stringify(c))),o}function n(t){var n=localStorage.getItem("tasks");n&&JSON.parse(n).forEach((function(n){if(n==t){console.log("should delete from storage");var l=e.indexOf(n);e.splice(l,1),localStorage.setItem("tasks",JSON.stringify(e))}}))}fetch("assets/help.txt").then((function(e){return e.text()})).then((function(n){var l=n.split("\n"),o=document.getElementById("HelpList");if(o){o.innerHTML="";var r=document.createElement("p");r.style.fontSize="15px",r.style.fontFamily="Trebuchet MS , sans-serif",r.style.color="rgb(91, 47, 11)",r.textContent="Help Options",r.style.fontWeight="900",r.style.textAlign="center",o.appendChild(r),function(e,t){t.forEach((function(t){var n=document.createElement("p");n.textContent=t.trim(),n.style.fontSize="15px",n.style.fontFamily="Trebuchet MS , sans-serif",n.style.color="rgb(91, 47, 11)",e.appendChild(n)}))}(o,l);var a=document.createElement("div");a.id="tasksContainerP",o.appendChild(a),function(n){var l=localStorage.getItem("tasks");if(l){var o=JSON.parse(l);e=o,console.log("after loading: "+e),o.forEach((function(e){var l=t(e,!0);n.appendChild(l)}))}}(a),function(e){var n=document.createElement("div");n.style.display="flex",n.style.flexDirection="row",n.style.width="100%",n.style.justifyContent="center";var l=document.createElement("textarea");l.id="TeacherHelp",l.style.borderRadius="10px 0 0 10px",l.rows=4,l.style.width="70%",l.placeholder="type personalized help here...",l.style.border="none",l.style.opacity="70%",l.style.boxShadow="rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",l.style.color="rgb(91, 47, 11";var o=document.createElement("button");o.style.border="none",o.style.color="rgb(91, 47, 11",o.style.borderRadius="0 10px 10px 0",o.style.textAlign="center",o.style.fontSize="13px",o.style.cursor="pointer",o.style.opacity="70%",o.textContent="Send",o.style.boxShadow="rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",function(e,n){e.addEventListener("click",(function(){var e=document.getElementById("tasksContainerP");e?(e.appendChild(t(n.value,!1)),console.log(n.value),n.value=""):console.log("it is null")}))}(o,l);var r=document.createElement("div");r.style.padding="1%",n.appendChild(l),n.appendChild(r),n.appendChild(o),e.appendChild(n)}(o);var i=document.createElement("div");i.style.padding="2%",i.style.borderRadius="17px",o.appendChild(i)}else console.error('Element with ID "TaskList" not found.')})).catch((function(e){return console.error("Error loading text file:",e)}))}))})();