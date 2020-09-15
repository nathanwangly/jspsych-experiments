/* create timeline */
var timeline = [];

/* participant ID */
var participant_id = jsPsych.randomization.randomID(5); // generate a random subject ID with 5 characters

  // track participant ID in experiment data
jsPsych.data.addProperties({
  participantID: participant_id,
  dateTime: new Date().toLocaleString()
});

/* welcome screen */
var welcomeScreen = {
  type: 'html-button-response',
  stimulus: '<h1>Financial Decision-Making Task</h1>' +
  '<br><p><img src="img/piggybank.jpg" style="width:500px;height:auto"></img></p>' +
  '<p>Thank you for participating in SONA Study 403.</p>' +
  '<p>Before the experiment starts, you will be asked to complete the participant consent form and to provide some demographic details.</p>' +
  '<p>Press <b>START</b> when you are ready to begin.',
  choices: ['START']
}

/* ethics */
var consent = {
  type: 'external-html',
  url: 'consent_exp.html',
  cont_btn: 'consented',
  check_fn: function() {
    jsPsych.data.addProperties(
      {
        wants_copy: document.getElementById('copy').checked,
      }
    );
    return true;
  }
};

/* Participant details collection */
var participant_details = {
  type: 'survey-html-form',
  preamble: '<h2>Participant Details</h2>',
  html: '<br><p><b>Age (years)</b></p><input name="age" type="number" min="0" max="99" style="width: 5em; height: 1.5em; font-size:1.2em" required/></p>' +
  '<br><b>Sex</b></p>' +
  '<input type="radio" name="sex" value="male" required> Male   ' +
  '<input type="radio" name="sex" value="female" required> Female   ' +
  '<input type="radio" name="sex" value="other" required> Other   ' +
  '<input type="radio" name="sex" value="na" required> Prefer not to say   ' +
  '<br><br><p><b>Email address (optional)</b></p>' +
  '<p>Your email address will only be used to contact you in the event <br> that you win a monetary reward from participating in this experiment.</p>' +
  '<input name="email" type="text"/></p>',
  on_finish: function(data){
    // string to JSON
    responses = JSON.parse(data.responses)

    jsPsych.data.addDataToLastTrial({
      age: responses.age,
      sex: responses.sex,
      email: responses.email
    })
  }
}

timeline.push(welcomeScreen)
timeline.push(consent)
timeline.push(participant_details)

// Before running the experiment, ensure that you have initialised the
// Batch session data with the condition sizes in a dictionary format.
// e.g., "Condition Sizes": {
//          "Condition 1": 0,
//          "Condition 2": 0,
//          "Condition 3": 0
//         }

// Function to direct participants to the condition with the fewest
// number of participants
function conditionAllocation() {

  // Dictionary linking condition names (in Batch Session data) to
  // component positions in JATOS
  var componentPositions = {
    "Income Low": 2,
    "Income Med": 3,
    "Income High": 4,
    "Goal Low": 5,
    "Goal Med": 6,
    "Goal High": 7
  }

  // Extract current number of participants per condition from Batch Session
  var conditionSizes = jatos.batchSession.get("Condition Sizes");

  // Identify condition with fewest participants
    // Selects first condition available if there is a tie
  var conditionNames = Object.keys(conditionSizes);
  var lowestSize = Math.min.apply(null, conditionNames.map(function(x) {return conditionSizes[x]}));
  var lowestCondition = conditionNames.filter(function(y) {return conditionSizes[y] === lowestSize});
  var lowestCondition = lowestCondition[0]

  // Update Batch session data
  var newConditionSizes = conditionSizes
  newConditionSizes[lowestCondition] = lowestSize + 1
  jatos.batchSession.set("Condition Sizes", newConditionSizes)

  // Return component position corresponding to assigned condition
  return(componentPositions[lowestCondition]);
}


/* start the experiment */
jatos.onLoad(
    function () {

      var nextComponentPosition = conditionAllocation();

      jsPsych.init(
          {
              timeline: timeline,
              on_finish: function() {

                  // prepare for SONA integration
                    // collect SONA ID
                  var sonaID = jatos.urlQueryParameters.id;
                  if (sonaID === undefined) {
                      sonaID = null;
                  }

                    // store SONA ID in results data
                  jsPsych.data.addProperties(
                    {sonaID: sonaID}
                  );

                  // collect results
                  var results = jsPsych.data.get().json();

                  // pass variables to next component
                  jatos.studySessionData["sonaID"] = JSON.parse(results)[2]["sonaID"]
                  jatos.studySessionData["participantID"] = JSON.parse(results)[2]["participantID"]
                  jatos.studySessionData["age"] = JSON.parse(results)[2]["age"]
                  jatos.studySessionData["sex"] = JSON.parse(results)[2]["sex"]
                  jatos.studySessionData["email"] = JSON.parse(results)[2]["email"]
                  jatos.studySessionData["wants_copy"] = JSON.parse(results)[2]["wants_copy"]

                  // submit results to JATOS
                  jatos.submitResultData(results, jatos.startComponentByPos(nextComponentPosition));
                },
            }
        );
    }
);
