let menuToggle = document.getElementById("menu-toggle");
let nav = document.querySelector("nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", function() {
        nav.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            nav.classList.contains("active")
        );
    });
}



let counter = 0;

const lightTheme = document.getElementById("light-theme");
const darkTheme = document.getElementById("dark-theme");
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", function() {

    if (counter === 0) {

        darkTheme.disabled = false;
        lightTheme.disabled = true;

        document.body.classList.add("dark-theme");

        counter++;

    } 
    
    else if (counter === 1) {

        lightTheme.disabled = false;
        darkTheme.disabled = true;

        document.body.classList.remove("dark-theme");

        counter = 0;

    }

});



// Contact Form Submission

let dbLink = "https://script.google.com/macros/s/AKfycbyH9KWYlSMw7CgxnDT6z2djqwBBhlOXN-Cz2gLJB_xRRDUIGes8sS7GXUJge0MGPIMp/exec";

let contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let msg = document.getElementById("msg").value;

        try {
            let response = await fetch(dbLink, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain; charset=utf-8"
                },
                body: JSON.stringify({
                    action: "save_message",
                    name: name,
                    email: email,
                    msg: msg
                })
            });

            let result = await response.json();

            if (!result.success) {
                alert("Failed to submit message");
            }

            alert("Message submitted successfully!");

            contactForm.reset();

        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again later.");
        }
    });
}

// Admin Login Form Submission
let adminForm = document.getElementById("admin-form");
let userResponses = document.getElementById("user-responses");
if (adminForm) {
    adminForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        try{
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;

            let response = await fetch(dbLink, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain; charset=utf-8"
                },
                body: JSON.stringify({
                    action: "login",
                    username: username,
                    password: password
                })

            });

            let result = await response.json();

            if(result.success){
                sessionStorage.setItem("adminLoggedIn", "true");
                window.location.href = "index.html"; 
            } else {
                alert("Invalid username or password.");
            }

        }catch(error){
            console.error(error);
            alert("Something went wrong. While trying to Login. Please try again later.");
        }
    });
}

// Display User Responses

if (performance.getEntriesByType("navigation")[0].type === "reload") {
    sessionStorage.removeItem("adminLoggedIn");
}

if (userResponses && sessionStorage.getItem("adminLoggedIn") === "true") {
    userResponses.style.display = "block";
    getUserResponses();
}


async function getUserResponses() {
    try {
        let responses = await fetch(dbLink, {
            method: "GET"
        });

        let result = await responses.json();
        console.log(result);

        if (!result.success) {
            alert("Failed to fetch user responses");
            return;
        }

        let userResponses = document.getElementById("user-responses");
        result.messages.forEach(responses => {
            let userResponceDiv = document.createElement("div");
            let namePara = document.createElement("p");
            let emailPara = document.createElement("p");
            let msgPara = document.createElement("p");
            let datePara = document.createElement("p");

            namePara.textContent = `Name: ${responses.name}`;
            emailPara.textContent = `Email: ${responses.email}`;
            msgPara.textContent = `Message: ${responses.message}`;
            datePara.textContent = `Date: ${responses.date}`;

            userResponceDiv.appendChild(namePara);
            userResponceDiv.appendChild(emailPara);
            userResponceDiv.appendChild(msgPara);
            userResponceDiv.appendChild(datePara);

            userResponses.appendChild(userResponceDiv);
        });

    } catch (error) {
        console.error("Error fetching user responses:", error);
    }
}