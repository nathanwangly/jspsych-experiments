
var consent = {
    type: "external-html",
    url: "consent.html",
    cont_btn: "consented",
    check_fn: function () {
        jsPsych.data.addProperties(
            {
                wants_copy: document.getElementById("copy").checked,
            }
        );
        return true;
    }
};

var debrief = {
    type: "external-html",
    url: "debrief.html",
    cont_btn: "been_debriefed",
};

jatos.onLoad(
    function () {

        // to make things easier to set up, we don't hard-code the completion
        // URL within the code - instead, we specify it in the JATOS GUI via
        // the JSON input option, and access that info here
        var finish_url_base = jatos.studyJsonInput.finish_url_base;

        // pull out the Sona ID from the URL
        // note that it is important that this is done using the JATOS property,
        // not the jsPsych property - JATOS messes with the URL such that the ID
        // won't be available to jsPsych
        // also important to note that this info is not available until within
        // the `jatos.onLoad` function
        var sona_id = jatos.urlQueryParameters.id;

        // ID is undefined if not coming from Sona
        if (sona_id === undefined) {
            sona_id = null;
        }

        jsPsych.data.addProperties({sona_id: sona_id});

        var redirect_url = null;

        if (sona_id) {
            // if we have a Sona ID, then use it to form the URL that the
            // participant needs to load in order to get credit
            redirect_url = finish_url_base + sona_id;
        }
        else {
            redirect_url = "https://unsw-psy.sona-systems.com";
        }

        jsPsych.init(
            {
                timeline: [
                    consent,
                    debrief,
                ],
                on_finish: function() {

                    var results = jsPsych.data.get().json();

                    jatos.submitResultData(results)
                        .done(jatos.endStudyAjax)
                        .done(
                            () => {
                                // once we're all done, redirect them to Sona
                                // to receive their credit
                                window.location.href = redirect_url;
                            }
                        );
                },
            }
        );
    }
);
