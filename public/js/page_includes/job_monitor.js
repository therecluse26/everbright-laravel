var JobStatusObject;

// Loads job list from jobstatus route
function loadJobs(){

    $.ajax({
        url: "/admin/api/jobstatus",
        method: "GET"
    }).done(function(resp){
        JobStatusObject = resp;

        if (JobStatusObject.length === 0){
            // Displays message for empty queue
            $("#status-container").html('<h4>Job Queue is empty! :)</h4>');

        } else {
            // Throws job list onto page
            $("#status-container").html('<ul id="job-list" style="list-style:none;"></ul>');

            $("#job-list").empty();
            for(let i = 0; i <= JobStatusObject.length - 1; i++){
                let current = JobStatusObject[i];
                $("#job-list").append(`<li>Id: ${current.job_id} - Name: ${current.name} - Start: ${current.started_at}</li>`); 
            }
        }
        
    })
}

$(document).ready(function(){

    setInterval(loadJobs, 500);

})
