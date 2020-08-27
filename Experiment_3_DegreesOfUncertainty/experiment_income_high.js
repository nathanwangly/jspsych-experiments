/* condition: low income uncertainty -- ranges between $450-$550 */

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

/* create timeline */
var timeline = [];

/* experiment parameters */

  // initial parameters
var score = 0;
var savings = 0;
var week = 1;
var cum_spending = 0

  // income parameters
var min_income = 50;
var max_income = 950;
var income_array_p = shuffle([145, 254, 256, 355, 419,
                              598, 618, 665, 820, 870])
var income_array_exp = shuffle([63, 76, 180, 249, 250,
                                268, 284, 309, 322, 347,
                                357, 419, 426, 471, 474,
                                575, 577, 586, 589, 619,
                                627, 691, 696, 709, 713,
                                720, 772, 841, 873, 917])

  // savings goal parameters
var n_exp_rounds = 30;
var savings_goal = 6000;

  // practice stage length
var n_practice_rounds = 10;

  // show savings goal?
var goal_tracker = false;

  // set experimental conditions
var uncertain_type = 'income'
var uncertain_level = 'high'

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
  uncertain_type: uncertain_type,
  uncertain_level: uncertain_level,
  income_array_p: income_array_p,
  income_array_exp: income_array_exp
});

/* instructions stage */

  // Welcome screen
var instructions_1 = 'Welcome to the experiment.' +
'<p>In this experiment, you will play a financial decision-making game.</p>' +
'<br><p>Click the <b>NEXT</b> button to continue.</p>'

  // Income screen
var instructions_2 = 'You have started a new job that provides you with a weekly income.' +
'<p>Each week, after covering your expenses, you are left with a disposable income that varies between $'+min_income+'-$'+max_income+'.</p>'

  // Savings goal screen
var instructions_3 = 'The air-conditioning system in your home has recently been having issues, so you would like to start saving up to repair it.' +
'<p>After organising an inspection, the tradesperson tells you that the total repair cost will be $'+savings_goal+'.</p>' +
'<p>You decide that you want to have enough saved for these repairs within '+n_exp_rounds+' weeks to prepare yourself for summer and its heatwaves.</p>'

 // Decision screen
var instructions_4 = 'Each week, you will be asked to decide how much of your money to spend and save.' +
'<p>Your objective in this game is to manage your spending and saving behaviour to score as many points as possible.</p>' +
'<br>You can earn points in two ways.' +
'<p><b>Spending:</b> You will be rewarded with 5 points for every $1 that you spend. This represents the benefit you gain from making purchases.</p>' +
'<p><b>Saving:</b> If you have enough saved for your repairs at the end of the game, you will also be rewarded with '+savings_reward+' points. Otherwise, you will receive no additional points.</p>' +
'<br><p>At the end of the experiment, your points from spending and saving will be combined to determine your score.</p>'

  // Reward screen
var instructions_5 = 'Once all participants have completed the experiment, the top 20% highest scoring participants will receive a real $20 reward.' +
'<p>If you are one of these participants, you will be contacted via the email address you provided earlier.</p>'

// Score tracking screen
var instructions_6 =
'<p>Your savings balance will be tracked in the top left corner of the screen.</p>' +
'<div id="jspsych-survey-text-custom-topleft" class="topleft"><font size="5em" color="red"><b>Savings: $'+savings+' / $'+savings_goal+'</b></font></div>' +
'<p>Your points total will be tracked in the top right corner of the screen.</p>' +
'<div id="jspsych-survey-text-custom-topright" class="topright"><font size="5em" color="red"><b>Score: '+score+' points</b></font></div>'

  // Summary screen

var instruction_summary_string = '<p>The game will last for '+n_exp_rounds+ ' weeks.</p>' +
'You will receive $'+min_income+'-'+max_income+' each week that can be spent or saved.</p>' +
'<p>You are hoping to have enough saved at the end of the game for repairs that will cost $'+savings_goal+'.</p>' +
'<p>Every $1 that you spend will earn 5 points.</p>' +
'<p>Having enough saved for the repairs will earn a bonus '+savings_reward+' points. Not saving enough will earn no bonus points.</p>' +
'<p>Your objective is to score as many points as possible.</p>'

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
    return '<b>Week '+week+' of '+n_practice_rounds+'</b>' +
    '<br><br><p>You have saved another $'+income+' this week. Your savings account balance is now $'+savings+'.</p>' +
    '<p>Please enter the amount you would like to <b>spend</b> this week in the box below.</p>'
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
      week: week,
      income: income,
      starting_savings: response + savings,
      amount_spent: response,
      points_earned: points_earned,
      points_cum: score,
      savings_remaining: savings
    })

    // add savings for next round (except if last round)
    income = income_array_p[week]
    savings += income

    // update week for next round
    week += 1
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

      // reset savings, score, week, and cumulative spending
      savings = 0;
      score = 0;
      week = 1;
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
    return '<b>Week '+week+ ' of ' + n_exp_rounds+'</b>' +
    '<br><br><p>You have saved another $'+income+' this week. Your savings account balance is now $'+savings+'.</p>' +
    '<p>Please enter the amount you would like to <b>spend</b> this week in the box below.</p>'
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
      week: week,
      income: income,
      starting_savings: response + savings,
      amount_spent: response,
      points_earned: points_earned,
      points_cum: score,
      savings_remaining: savings
    })

    // add savings for next round (except if last round)
    if (week < n_exp_rounds){
      income = income_array_exp[week]
      savings += income

      // update week for next round
      week += 1
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

      if (remaining_balance >= 0 ) {
        savings_score = '<h2>Saving</h2>' +
        '<br><p>You were hoping to have $'+savings_goal+' saved for your air-conditioning repairs.</p>' +
        '<p>You had $'+savings+' saved at the end of the final week.' +
        '<p>Congratulations! By having enough saved, you have earned a bonus '+savings_reward+' points.'

        total_score = score + savings_reward

      } else {
        savings_score = '<h2>Saving</h2>' +
        '<br><p>You were hoping to have $'+savings_goal+' saved for your air-conditioning repairs.</p>' +
        '<p>You had $'+savings+' saved at the end of the final week.' +
        '<p>Unfortunately, you did not have enough saved! You have earned 0 bonus points.'

        // no reward for failure to meet savings goal
        savings_reward = 0
        total_score = score + savings_reward

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
timeline.push(instructions_stage)
timeline.push(practice_rounds)
timeline.push(end_practice_rounds)
timeline.push(exp_rounds)
timeline.push(end_stage_e)
timeline.push(debrief)

/* start the experiment */
jsPsych.init({
    timeline: timeline,
    on_finish: function(){
      jsPsych.data.displayData();
    }
});
