/* create timeline */
var timeline = [];

/* experiment parameters */

  // initial parameters
var score = 0;
var savings = 0;
var month = 1;
var cum_spending = 0

  // income parameters
var income = 500;
var min_income = 250;
var max_income = 750;

  // savings goal parameters
var n_exp_rounds = 3;
var savings_goal = 100;
var min_savings_goal = 4000;
var max_savings_goal = 8000;

  // practice stage length
var n_practice_rounds = 1;

  // show savings goal?
var goal_tracker = false;

  // randomise experimental conditions

    // vary whether income and goal are certain; 0 = certain, 1 = uncertain
var income_condition = Math.round(Math.random())
var goal_condition = Math.round(Math.random())

    // function to shuffle array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

  // income arrays
if (income_condition == 0){
  var income_array_p = Array(n_practice_rounds).fill(income)
  var income_array_exp = Array(n_exp_rounds).fill(income)
} else {
  var income_array_p = shuffle([320, 341, 446, 463, 496,
                                524, 529, 546, 641, 694])
  var income_array_exp = shuffle([259, 269, 292, 310, 333,
                                  336, 357, 387, 403, 417,
                                  418, 426, 432, 462, 468,
                                  500, 509, 513, 551, 616,
                                  620, 633, 638, 661, 678,
                                  682, 688, 693, 716, 733])
}

console.log(income_condition)
console.log(goal_condition)
console.log(income_array_p)
console.log(income_array_exp)

  // points conversion rate
conversion = function(amount_spent) {
  points = amount_spent * 5
  return(Math.round(points))
}

  // reward for reaching savings goal
savings_reward = 45000

/* participant ID */
var participant_id = jsPsych.randomization.randomID(5); // generate a random subject ID with 5 characters

  // track participant ID in experiment data
jsPsych.data.addProperties({
  participantID: participant_id,
  dateTime: new Date().toLocaleString(),
  income_condition: income_condition,
  goal_condition: goal_condition,
  income_array_p: income_array_p,
  income_array_exp: income_array_exp

});

/* open in fullscreen */
var fullscreenOn = {
  type: 'fullscreen',
  fullscreen_mode: true,
  message: function() {
    return '<h1>Financial Decision-Making Task</h1>' +
    '<br><p><img src="img/piggybank.jpg" style="width:500px;height:auto"></img></p>'
  },
  button_label: 'Begin the experiment!',
  delay_after: 200
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

/* instructions stage */

  // Welcome screen
var instructions_1 = 'Welcome to the experiment.' +
'<p>In this experiment, you will play a financial decision-making game.</p>' +
'<br><p>Click the <b>NEXT</b> button to continue.</p>'

  // Income screen
if (income_condition == 0){
  var instructions_2 = 'You have started a new job that provides you with a monthly income.' +
  '<p>Each month, after covering your expenses, you are left with a disposable income of $'+income+'.</p>'
} else {
  var instructions_2 = 'You have started a new job that provides you with a monthly income.' +
  '<p>Each month, after covering your expenses, you are left with a disposable income that varies between $'+min_income+'-'+max_income+'.</p>'
}

  // Savings goal screen
if (goal_condition == 0){
  var instructions_3 = 'You decide that you want to start saving for a holiday trip.' +
  '<p>You know the trip will cost $'+savings_goal+' and want to have enough saved for it after '+n_exp_rounds+' months.</p>'
} else {
  var instructions_3 = 'You decide that you want to start saving for a holiday trip.' +
  "<p>You know the trip will cost between $"+min_savings_goal+'-'+max_savings_goal+' and want to have enough saved for it after '+n_exp_rounds+' months.</p>'
}

 // Decision screen
var instructions_4 = 'Each month, you will be asked to decide how much of your money to spend and save.' +
'<p>Your objective in this game is to manage your spending and saving behaviour to score as many points as possible.</p>' +
'<br>You can earn points in two ways.' +
'<p><b>Spending:</b> You will be rewarded with 5 points for every $1 that you spend.</p>' +
'<p><b>Saving:</b> If you have enough saved for your trip at the end of the game, you will also be rewarded with '+savings_reward+' points. Otherwise, you will receive no additional points.</p>' +
'<br><p>At the end of the experiment, your points from spending and saving will be combined to determine your score.</p>'

  // Reward screen
var instructions_5 = 'Once all participants have completed the experiment, the top 20% highest scoring participants will receive a real $20 reward.' +
'<p>If you are one of these participants, you will be contacted via the email address you provided earlier.</p>'

  // Score tracking screen
var instructions_6 =
'<p>Your savings balance will be tracked in the top left corner of the screen.</p>' +
'<div id="jspsych-survey-text-custom-topleft" class="topleft"><font size="6em" color="red"><b>Savings: $'+savings+'</b></font></div>' +
'<p>Your points total will be tracked in the top right corner of the screen.</p>' +
'<div id="jspsych-survey-text-custom-topright" class="topright"><font size="6em" color="red"><b>Score: '+score+' points</b></font></div>'

  // Summary screen
if (income_condition == 0 && goal_condition == 0){
  var instruction_summary_string = '<p>The game will last for '+n_exp_rounds+ ' months.</p>' +
  'You will receive $'+income+' each month that can be spent or saved.</p>' +
  '<p>You are hoping to have enough saved at the end of the game for a trip that will cost $'+savings_goal+'.</p>' +
  '<p>Every $1 that you spend will earn 5 points.</p>' +
  '<p>Having enough saved for the trip will earn a bonus '+savings_reward+' points. Not saving enough will earn no bonus points.</p>' +
  '<p>Your objective is to score as many points as possible.</p>'
} else if (income_condition == 1 && goal_condition == 0){
  var instruction_summary_string = '<p>The game will last for '+n_exp_rounds+ ' months.</p>' +
  'You will receive $'+min_income+'-'+max_income+' each month that can be spent or saved.</p>' +
  '<p>You are hoping to have enough saved at the end of the game for a trip that will cost $'+savings_goal+'.</p>' +
  '<p>Every $1 that you spend will earn 5 points.</p>' +
  '<p>Having enough saved for the trip will earn a bonus '+savings_reward+' points. Not saving enough will earn no bonus points.</p>' +
  '<p>Your objective is to score as many points as possible.</p>'
} else if (income_condition == 0 && goal_condition == 1){
  var instruction_summary_string = '<p>The game will last for '+n_exp_rounds+ ' months.</p>' +
  'You will receive $'+income+' each month that can be spent or saved.</p>' +
  '<p>You are hoping to have enough saved at the end of the game for a trip that will cost between $'+min_savings_goal+'-'+max_savings_goal+'.</p>' +
  '<p>Every $1 that you spend will earn 5 points.</p>' +
  '<p>Having enough saved for the trip will earn a bonus '+savings_reward+' points. Not saving enough will earn no bonus points.</p>' +
  '<p>Your objective is to score as many points as possible.</p>'
} else {
  var instruction_summary_string = '<p>The game will last for '+n_exp_rounds+ ' months.</p>' +
  'You will receive $'+min_income+'-'+max_income+' each month that can be spent or saved.</p>' +
  '<p>You are hoping to have enough saved at the end of the game for a trip that will cost between $'+min_savings_goal+'-'+max_savings_goal+'.</p>' +
  '<p>Every $1 that you spend will earn 5 points.</p>' +
  '<p>Having enough saved for the trip will earn a bonus '+savings_reward+' points. Not saving enough will earn no bonus points.</p>' +
  '<p>Your objective is to score as many points as possible.</p>'
}

var instructions_7 = '<b><u>Summary</u></b>' + instruction_summary_string +
'<br><p>Click the <b>NEXT</b> button when you are ready to proceed to the practice stage.</p>'

var starting_instructions = {

  type: 'instructions',
  pages: [
    instructions_1,
    instructions_2,
    instructions_3,
    instructions_4,
    instructions_5,
    instructions_6,
    instructions_7
  ],
  show_clickable_nav: true
};

var start_practice_rounds = {
    type: 'html-button-response',
    stimulus: function() {
      return 'You will now be presented with several practice rounds to familiarise yourself with the task.' +
      '<p>The practice rounds are identical to the actual game rounds.</p>' +
      '<br><p>Click the <b>START</b> button when you are ready to begin.</p>'
    },
    choices: ['<p style="font-size:130%;line-height:0%;"><b>START!</b></p>'],
    on_finish: function(trial) {

      // add initial savings (first round only)
      income = income_array_p[0]
      savings += income
    }
};

var instructions_stage = {
  timeline: [starting_instructions, start_practice_rounds],
}

/* practice rounds */
var choice_p = {

  type: 'free-text-response',
  topleft: true,
  topright: true,
  preamble: function() {
    return '<b>Month '+month+' of '+n_practice_rounds+'</b>' +
    '<br><br><p>You have saved another $'+income+' this month. Your savings account balance is now $'+savings+'.</p>' +
    '<p>Please enter the amount you would like to <b>spend</b> this month in the box below.</p>'
  },
  questions: [
  {prompt: '',
  rows: 1,
  columns: 100,
  required: true}
  ],
  data: {stage: 'practice',
         type: 'choice'},
  on_finish: function(data, trial){

    amount_spent_string = 'This round you spent $'+response+'.'

    // record cumulative spending
    cum_spending += response

    // calculate points earned
    points_earned = conversion(response)
    points_earned_string = '<p>Your spending has earned '+points_earned+' points this round.</p>'

    // playback score and savings
    points_total_string = '<br><b>Current score:</b> '+score+' points'
    savings_remaining_string = '<p><b>Current savings balance:</b> $'+savings+'</p>'

    round_feedback = amount_spent_string + points_earned_string + points_total_string + savings_remaining_string

    // record amount spent, points earned, points total, remaining savings
    jsPsych.data.addDataToLastTrial({
      stage: 'practice',
      month: month,
      starting_savings: response + savings,
      amount_spent: response,
      points_earned: points_earned,
      points_cum: score,
      savings_remaining: savings
    })

    // add savings for next round (except if last round)
    income = income_array_p[month]
    savings += income

    // update month for next round
    month += 1
  }
};

var feedback_p = {

  type: 'html-keyboard-response',
  stimulus: function() {
    return round_feedback
  },
  prompt: '<br><br>Press the ENTER or SPACEBAR key to continue.',
  choices: [13, 32],
  data: {stage: 'practice',
         type: 'feedback'},
};

var practice_rounds = {
  timeline: [choice_p, feedback_p],
  repetitions: n_practice_rounds
};

/* end of practice stage */

var end_stage_p = {
    type: 'html-button-response',
    stimulus: function() {
      return '<h2>Practice Stage Complete</h2>' +
      '<br><br>Thank you for completing the practice rounds.' +
      '<p>You will now begin the experiment stage.</p>' +
      '<p>Your points and account balance have been reset.</p>'
    },
    choices: ['<p style="font-size:130%;line-height:0%;"><b>Continue</b></p>'],
    data: {stage: 'practice',
           type: 'choice'},
    on_finish: function(data) {

      // record outcome
      jsPsych.data.addDataToLastTrial({
        savings: savings,
        score: score,
      })
    }
};

/* summary of experiment instructions */

var instructions_reminder = {
    type: 'html-button-response',
    stimulus: function() {
      return '<b><u>Reminder</u></b>' + instruction_summary_string +
      '<br><p>Click the <b>START</b> button when you are ready to begin the experiment stage.</p>'
    },
    choices: ['<p style="font-size:130%;line-height:0%;"><b>START!</b></p>'],
    on_finish: function(trial) {

      // reset savings, score, month, and cumulative spending
      savings = 0;
      score = 0;
      month = 1;
      cum_spending = 0;

      // add initial savings (first round only)
      income = income_array_exp[0]
      savings += income
    }
};

var end_practice_rounds = {
  timeline: [end_stage_p, instructions_reminder]
};

/* experiment rounds */
var choice_e = {

  type: 'free-text-response',
  topleft: true,
  topright: true,
  preamble: function() {
    return '<b>Month '+month+ ' of ' + n_exp_rounds+'</b>' +
    '<br><br><p>You have saved another $'+income+' this month. Your savings account balance is now $'+savings+'.</p>' +
    '<p>Please enter the amount you would like to <b>spend</b> this month in the box below.</p>'
  },
  questions: [
  {prompt: '',
  rows: 1,
  columns: 100,
  required: true}
  ],
  data: {stage: 'exp',
         type: 'choice'},
  on_start: function(trial) {
    // show savings goal
    goal_tracker = true;
  },
  on_finish: function(data, trial) {
    amount_spent_string = 'This round you spent $'+response+'.'

    // record cumulative spending
    cum_spending += response

    // calculate points earned
    points_earned = conversion(response)
    points_earned_string = '<p>Your spending has earned '+points_earned+' points this round.</p>'

    // playback score and savings
    points_total_string = '<br><b>Current score:</b> '+score+' points'
    savings_remaining_string = '<p><b>Current savings balance:</b> $'+savings+'</p>'

    round_feedback = amount_spent_string + points_earned_string + points_total_string + savings_remaining_string

    // record amount spent, points earned, points total, remaining savings
    jsPsych.data.addDataToLastTrial({
      stage: 'exp',
      month: month,
      starting_savings: response + savings,
      amount_spent: response,
      points_earned: points_earned,
      points_cum: score,
      savings_remaining: savings
    })

    // add savings for next round (except if last round)
    if (month < n_exp_rounds){
      income = income_array_exp[month]
      savings += income

      // update month for next round
      month += 1
    }
  }
};

var feedback_e = {

  type: 'html-keyboard-response',
  stimulus: function() {
    return round_feedback
  },
  prompt: '<br><br>Press the ENTER or SPACEBAR key to continue.',
  choices: [13, 32],
  data: {stage: 'exp',
         type: 'feedback'},
};

var exp_rounds = {
  timeline: [choice_e, feedback_e],
  repetitions: n_exp_rounds
};

/* experiment outcome */

var end_exp_rounds = {
    type: 'html-button-response',
    stimulus: function() {
      return '<h2>Experiment Stage Complete</h2>' +
      '<br><br>You have now completed the experiment rounds.' +
      "<p>Let's see how many points you scored!"
    },
    choices: ['<p style="font-size:130%;line-height:0%;"><b>Continue</b></p>'],
    on_finish: function(trial) {

      // calculate spending score
      spending_score = '<h2>Spending</h2>' +
      '<br><p>You spent $'+cum_spending+' across the experiment rounds.</p>' +
      '<p>This has earned you '+score+' points.</p>'

      // calculate savings score

        // conditional on reaching savings goal
      remaining_balance = savings - savings_goal

      if (goal_condition == 0){
        if (remaining_balance >= 0 ) {
          savings_score = '<h2>Saving</h2>' +
          '<br><p>You were hoping to have $'+savings_goal+' saved for your holiday trip.</p>' +
          '<p>You had $'+savings+' saved at the end of the final month.' +
          '<p>Congratulations! By having enough saved, you have earned a bonus '+savings_reward+' points.'

          total_score = score + savings_reward

        } else {
          savings_score = '<h2>Saving</h2>' +
          '<br><p>You were hoping to have $'+savings_goal+' saved for your holiday trip.</p>' +
          '<p>You had $'+savings+' saved at the end of the final month.' +
          '<p>Unfortunately, you did not have enough saved! You have earned 0 bonus points.'

          // no reward for failure to meet savings goal
          savings_reward = 0
          total_score = score + savings_reward
        }
      } else {
        if (remaining_balance >= 0 ) {
          savings_score = '<h2>Saving</h2>' +
          '<br><p>The holiday trip ended up costing $'+savings_goal+'.</p>' +
          '<p>You had $'+savings+' saved at the end of the final month.' +
          '<p>Congratulations! By having enough saved, you have earned a bonus '+savings_reward+' points.'

          total_score = score + savings_reward

        } else {
          savings_score = '<h2>Saving</h2>' +
          '<br><p>The holiday trip ended up costing $'+savings_goal+'.</p>' +
          '<p>You had $'+savings+' saved at the end of the final month.' +
          '<p>Unfortunately, you did not have enough saved! You have earned 0 bonus points.'

          // no reward for failure to meet savings goal
          savings_reward = 0
          total_score = score + savings_reward
        }
      }

      final_score = '<h2>Your final score is: '+total_score+' points</h2>' +
      '<p>Points earned from spending: '+score+' points</p>' +
      '<p>Points earned from saving: '+savings_reward+' points</p>' +
      '<br><p>Thank you for participating in this experiment :)</p>' +
      '<p>Click the <b>CONTINUE</b> button to proceed to the debriefing stage.</p>' +
      '<p><font color="red">Please DO NOT exit the browser. You will need to click a link after the debrief to receive your SONA credit.</font></p>'
    }
};

var outcome_spending = {
    type: 'html-button-response',
    stimulus: function() {
      return spending_score
    },
    choices: ['<p style="font-size:130%;line-height:0%;"><b>Continue</b></p>']
};

var outcome_saving = {
    type: 'html-button-response',
    stimulus: function() {
      return savings_score
    },
    choices: ['<p style="font-size:130%;line-height:0%;"><b>Continue</b></p>'],
    on_finish: function(data) {

      // record outcome
      jsPsych.data.addDataToLastTrial({
        savings_goal: savings_goal,
        savings: savings,
        remaining_savings: remaining_balance,
        //outcome: outcome_e,
        spending_score: score,
        savings_score: savings_reward,
        total_score: total_score
      })
    }
};

/* final outcome screen */
var outcome_final = {
    type: 'html-button-response',
    stimulus: function() {
      return final_score
    },
    choices: ['<p style="font-size:130%;line-height:0%;"><b>Continue</b></p>']
};

var end_stage_e = {
  timeline: [end_exp_rounds, outcome_spending, outcome_saving, outcome_final]
};

var debrief = {
  type: 'external-html',
  url: 'debrief_exp.html',
  cont_btn: 'been_debriefed'
}

timeline.push(fullscreenOn)
//timeline.push(consent)
//timeline.push(participant_details)
timeline.push(instructions_stage)
timeline.push(practice_rounds)
timeline.push(end_practice_rounds)
timeline.push(exp_rounds)
timeline.push(end_stage_e)
//timeline.push(debrief)

/* start the experiment */
jsPsych.init({
    timeline: timeline,
    on_finish: function(){
      jsPsych.data.displayData();
    }
});
