/*
 *
 *      Infinite 3-Card Poker Demo
 *
 */

//Global Variables

var user_hand = undefined;
var house_hand = undefined;
var stack = 640; //640 = 10 stacks of gold nuggets
var ante = 4;
var pair_plus = 0;
var hand_counter = 0;
var stack_snapshot = stack;

const to_qualify = 11; // King

const pair_pay = 2;
const flush_pay = 4;
const straight_pay = 5;
const flush_pair_pay = 6;
const trips_pay = 10;
const straight_flush_pay = 13;
const flush_trips_pay = 31;

//
//Helper Functions
//

//Randomize 3 cards, return array of cards
function deal_hand() {
    r1 = Math.floor(Math.random() * 13);
    r2 = Math.floor(Math.random() * 13);
    r3 = Math.floor(Math.random() * 13);
    arr = [r1, r2, r3];
    arr.sort((a, b) => a - b);
    s1 =  Math.floor(Math.random() * 4);
    s2 =  Math.floor(Math.random() * 4);
    s3 =  Math.floor(Math.random() * 4);
    parsed_ranks = [parse_card_rank([arr[0], s1]), parse_card_rank([arr[1], s2]), parse_card_rank([arr[2], s3])]
    result = [[arr[0], s1], [arr[1], s2], [arr[2], s3], parsed_ranks];
    return result;
}

//Return rank as a string
function parse_card_rank(card) {
    rank = card[0];
    parsed_rank = undefined;
    if (rank == 0) {
        parsed_rank = "2"
    } else if (rank == 1) {
        parsed_rank = "3"
    } else if (rank == 2) {
        parsed_rank = "4"
    } else if (rank == 3) {
        parsed_rank = "5"
    } else if (rank == 4) {
        parsed_rank = "6"
    } else if (rank == 5) {
        parsed_rank = "7"
    } else if (rank == 6) {
        parsed_rank = "8"
    } else if (rank == 7) {
        parsed_rank = "9"
    } else if (rank == 8) {
        parsed_rank = "T"
    } else if (rank == 9) {
        parsed_rank = "J"
    } else if (rank == 10) {
        parsed_rank = "Q"
    } else if (rank == 11) {
        parsed_rank = "K"
    } else if (rank == 12) {
        parsed_rank = "A"
    }
    return parsed_rank;
}

//Render cards in webpage
//REMOVED RENDERING OF RANK
//HANDLED DIRECTLY BY EVENT HANDLERS
function render_card(card, card_name, hide) {
    //r = parse_card_rank(card);
    s = card[1];
    $(card_name).addClass("flipped_card");
    //$(card_name).text(r);
    if (s == 0) {
        $(card_name).addClass('spade');
        $(card_name).removeClass('heart');
        $(card_name).removeClass('club');
        $(card_name).removeClass('diamond');
    } else if (s == 1) {
        $(card_name).addClass('heart');
        $(card_name).removeClass('spade');
        $(card_name).removeClass('club');
        $(card_name).removeClass('diamond');
    } else if (s == 2) {
        $(card_name).addClass('club');
        $(card_name).removeClass('heart');
        $(card_name).removeClass('spade');
        $(card_name).removeClass('diamond');
    } else {
        $(card_name).addClass('diamond');
        $(card_name).removeClass('heart');
        $(card_name).removeClass('club');
        $(card_name).removeClass('spade');
    }
    if (!hide) $(card_name).removeClass('flipped_card');
}

//Initiate new hand
function new_hand() {
    game_state = 0;
    stack_snapshot = stack;
    //Deal Cards
    user_hand = deal_hand();
    house_hand = deal_hand();
    //alert(user_hand);
    //alert(user_hand);
    //alert(house_hand);
    //house_hand = [[7, 0], [7, 3], [7, 2], ["9", "9", "9"]];
    //user_hand = [[3, 1], [8, 0], [8, 2], ["5", "T", "T"]];
    

    //Render User Data & Controls
    hide_user_cards = true;
    user_c1 = user_hand[0];
    user_c2 = user_hand[1];
    user_c3 = user_hand[2];
    render_card(user_c1, "#user_c1", hide_user_cards);
    render_card(user_c2, "#user_c2", hide_user_cards);
    render_card(user_c3, "#user_c3", hide_user_cards);
    $("#user_c1").text("X");
    $("#user_c2").text("X");
    $("#user_c3").text("X");
    user_result = get_hand_data(user_hand);
    user_hand_string = user_result[2];
    $("#user_hand_type").text("");
    $('#play_ante').removeClass('disabled');
    $('#play').addClass('disabled');
    $('#fold').addClass('disabled');
    //$('#reset').addClass('disabled');
    $("#stack").text("$" + stack);
    //$('#comparator').text('?');
    $('.small_button').removeClass('disabled');


    //Render House Data
    hide_house_cards = true;
    house_c1 = house_hand[0];
    house_c2 = house_hand[1];
    house_c3 = house_hand[2];
    render_card(house_c1, "#house_c1", hide_house_cards);
    render_card(house_c2, "#house_c2", hide_house_cards);
    render_card(house_c3, "#house_c3", hide_house_cards);
    $("#house_c1").text("X");
    $("#house_c2").text("X");
    $("#house_c3").text("X");
    house_result = get_hand_data(house_hand);
    house_hand_string = house_result[2];
    $("#house_hand_type").text("");

}

//Return true if user had the better hand or tied
function is_user_winner() {
    user_result = get_hand_data(user_hand);
    house_result = get_hand_data(house_hand);
    if (user_result[0] > house_result[0]) {
        return true;
    } else if (user_result[0] == house_result[0] && user_result[1] >= house_result[1]) {
        return true;
    } else {
        return false;
    }
}

//Return true if house qualifies
function house_qualified() {
    house_result = get_hand_data(house_hand);
    if (house_result[0] > 0) {
        return true;
    } else if (house_result[1] >= to_qualify) {
        return true;
    } else {
        return false;
    }
}

//Pay user ante and pair+
function payout() {
    user_result = get_hand_data(user_hand);
    house_qualiifies = house_qualified();
    type = user_result[0];
    won = is_user_winner();

    //ante & play payout
    //STILL WIP OMG FIGURE IT OUT NERD
    if (!house_qualiifies) {
        stack += ((2 * ante) + (ante / 2)); // Ante pays 1:1, Play pays 2:1
    } else if (house_qualiifies && won) {
        stack += (4 * ante); // Ante pays 1:1, Play pays 1:1
    }
    
    //pair plus payout
    if (type == 1) {
        stack += (pair_pay * pair_plus);
    }
     else if (type == 2) {
        stack += (flush_pay * pair_plus);
    }
     else if (type == 3) {
        stack += (straight_pay * pair_plus);
    }
     else if (type == 4) {
        stack += (flush_pair_pay * pair_plus);
    }
     else if (type == 5) {
        stack += (trips_pay * pair_plus);
    }
     else if (type == 6) {
        stack += (straight_flush_pay * pair_plus);
    }
     else if (type == 7) {
        stack += (flush_trips_pay * pair_plus);
    }
}

//
//Hand Data Functions
//

//Return an array
// [hand type, active card, error msg]
function get_hand_data(hand) {
    error_check = 0;
    error_msg = "";
    hand_type = 0;
    active_card_rank = hand[2][0];
    if (hand[0][0] == hand[1][0]) active_card_rank = hand[0][0];
    if (is_highcard(hand)) {
        hand_type = 0;
        error_check++;
        error_msg += "Highcard";
    }
    if (is_pair(hand)) {
        hand_type = 1;
        error_check++;
        error_msg += "Pair";
    }
    if (is_flush(hand)) {
        hand_type = 2;
        error_check++;
        error_msg += "Flush";
    }
    if (is_straight(hand)) {
        hand_type = 3;
        error_check++;
        error_msg += "Straight";
    }
    if (is_flush_pair(hand)) {
        hand_type = 4;
        error_check++;
        error_msg += "Flush Pair";
    }
    if (is_trips(hand)) {
        hand_type = 5;
        error_check++;
        error_msg += "Trips";
    }
    if (is_straight_flush(hand)) {
        hand_type = 6;
        error_check++;
        error_msg += "Straight Flush";
    }
    if (is_flush_trips(hand)) {
        hand_type = 7;
        error_check++;
        error_msg += "Flush Trips";
    }

    if (error_check > 1) {
        alert(error_msg);
    }

    return [hand_type, active_card_rank, error_msg];
}

//Return true if hand is high card
function is_highcard(hand) {
    if (hand[0][0] == hand[1][0] || hand[1][0] == hand[2][0] || hand[2][0] == hand[0][0]) {
        return false; //Ranks Match
    } else if (hand[0][1] == hand[1][1] && hand[0][1] == hand[2][1]) {
        return false; //Suits Match
    } else if ((hand[0][0] - hand[1][0] == -1) && (hand[1][0] - hand[2][0] == -1 || hand[1][0] - hand[2][0] == -11)) {
        return false; //Straight
    } else {
        return true;
    }
}

//Return true if hand is pair (no flush pair)
function is_pair(hand) {
    if (hand[0][0] == hand[1][0] && hand[1][0] == hand[2][0]) {
        return false; //Trips
    } else if (hand[0][1] == hand[1][1] && hand[0][1] == hand[2][1]) {
        return false; //Flush
    } else if (hand[0][0] == hand[1][0] || hand[1][0] == hand[2][0] || hand[2][0] == hand[0][0]) {
        return true;
    } else {
        return false;
    }
}

//Return true if hand is flush (no flush pair, straight flush, etc)
function is_flush(hand) {
    if (hand[0][0] == hand[1][0] || hand[1][0] == hand[2][0] || hand[2][0] == hand[0][0]) {
        return false; // Pair or Trips
    } else if ((hand[0][0] - hand[1][0] == -1) && (hand[1][0] - hand[2][0] == -1 || hand[1][0] - hand[2][0] == -11)) {
        return false; //Straight
    }  else if (hand[0][1] == hand[1][1] && hand[0][1] == hand[2][1]) {
        return true; //Flush
    } else {
        return false;
    }
}

//Return true if hand is straight (no straight flush)
function is_straight(hand) {
    if (hand[0][0] == hand[1][0] || hand[1][0] == hand[2][0] || hand[2][0] == hand[0][0]) {
        return false; //Pair or Trips
    } else if (hand[0][1] == hand[1][1] && hand[0][1] == hand[2][1]) {
        return false; //Flush
    } else if ((hand[0][0] - hand[1][0] == -1) && (hand[1][0] - hand[2][0] == -1 || hand[1][0] - hand[2][0] == -11)) {
        return true; //Straight
    } else {
        return false;
    }
}

//Return true if hand is flush pair
function is_flush_pair(hand) {
    if (hand[0][0] == hand[1][0] && hand[1][0] == hand[2][0]) {
        return false; //Trips
    } else if ((hand[0][0] == hand[1][0] || hand[1][0] == hand[2][0] || hand[2][0] == hand[0][0]) && (hand[0][1] == hand[1][1] && hand[0][1] == hand[2][1])) {
        return true;
    } else {
        return false;
    }
}

//Return true if hand is trips (not flush trips)
function is_trips(hand) {
    if (hand[0][0] == hand[1][0] && hand[1][0] == hand[2][0] && !(hand[0][1] == hand[1][1] && hand[0][1] == hand[2][1])) {
        return true; 
    } else {
        return false;
    }
}

//Return true if hand is straight flush
function is_straight_flush(hand) {
    if (hand[0][0] == hand[1][0] || hand[1][0] == hand[2][0] || hand[2][0] == hand[0][0]) {
        return false; //Pair or Trips
    } else if ((hand[0][0] - hand[1][0] == -1) && (hand[1][0] - hand[2][0] == -1 || hand[1][0] - hand[2][0] == -11) && (hand[0][1] == hand[1][1] && hand[0][1] == hand[2][1])) {
        return true;
    } else {
        return false;
    }
}

//Return true if hand is flush trips
function is_flush_trips(hand) {
    if (hand[0][0] == hand[1][0] && hand[1][0] == hand[2][0] && (hand[0][1] == hand[1][1] && hand[0][1] == hand[2][1])) {
        return true;
    } else {
        return false;
    }
}

//
// Load Page
//

$(document).ready(function() {
    // Load Page
    // SHOULD REPLACE THIS WHOLE STARTING SEQUENCE WITH new-hand()!!!!!!!!!!!!!
    game_state = 0;

    //Deal Cards
    user_hand = deal_hand();
    house_hand = deal_hand();
    //alert(user_hand);
    //alert(house_hand);
    //house_hand = [[7, 0], [7, 3], [7, 2], ["9", "9", "9"]];
    //user_hand = [[3, 1], [8, 0], [8, 2], ["5", "T", "T"]];

    //Render User Data & Controls
    hide_user_cards = true;
    user_c1 = user_hand[0];
    user_c2 = user_hand[1];
    user_c3 = user_hand[2];
    render_card(user_c1, "#user_c1", hide_user_cards);
    render_card(user_c2, "#user_c2", hide_user_cards);
    render_card(user_c3, "#user_c3", hide_user_cards);
    user_result = get_hand_data(user_hand);
    user_hand_string = user_result[2];
    $('#play').addClass('disabled');
    $('#fold').addClass('disabled');
    //$('#reset').addClass('disabled');
    $("#stack").text("$" + stack);
    $('#ante_amount').text("$" + ante + " Ante Bet");
    $('#pair_plus_amount').text("$" + pair_plus + " Pair+ Bet");
    $('.small_button').removeClass('disabled');


    //Render House Data
    hide_house_cards = true;
    house_c1 = house_hand[0];
    house_c2 = house_hand[1];
    house_c3 = house_hand[2];
    render_card(house_c1, "#house_c1", hide_house_cards);
    render_card(house_c2, "#house_c2", hide_house_cards);
    render_card(house_c3, "#house_c3", hide_house_cards);
    house_result = get_hand_data(house_hand);
    house_hand_string = house_result[2];

    //
    //click event handlers
    //

    //User clicks Ante button
    $('#play_ante').click(function(evt) {
        if (!($('#play_ante').hasClass('disabled')) && stack >= (2 * ante + pair_plus)) {
            game_state = 1;
            hand_counter++;
            stack += -(ante + pair_plus);
            $("#stack").text("$" + stack);
            $("#hand_count").text("#" + hand_counter);
            $("#stack_change").removeClass("green_text red_text yellow_text");
            $("#stack_change").text("");
            $("#user_c1").removeClass('flipped_card');
            $("#user_c2").removeClass('flipped_card');
            $("#user_c3").removeClass('flipped_card');
            $("#user_c1").text(user_hand[3][0]);
            $("#user_c2").text(user_hand[3][1]);
            $("#user_c3").text(user_hand[3][2]);
            $('#reset').addClass('disabled');
            $('#play').removeClass('disabled');
            $('#fold').removeClass('disabled');
            $('#play_ante').addClass('disabled');
            $('.small_button').addClass('disabled');

        }
        //evt.preventDefault();
    });

    //User clicks Play button
    $('#play').click(function(evt) {
        if (!($('#play').hasClass('disabled'))) {
            game_state = 2;
            stack += -(ante);
            payout();
            difference = stack - stack_snapshot;
            if (difference > 0) {
                $("#stack_change").addClass('green_text');
                $('#stack_change').text("+" + difference);
            } else if (difference < 0) {
                $("#stack_change").addClass('red_text');
                $('#stack_change').text(difference);
            } else {
                $("#stack_change").addClass('yellow_text');
                $('#stack_change').text(difference);
            }
            if (is_user_winner()) {
                $("#user_indicator").addClass('winner');
                $('#house_indicator').addClass('loser');
            } else {
                $("#user_indicator").addClass('loser');
                $('#house_indicator').addClass('winner');
            }
            $("#stack").text("$" + stack);
            $("#house_hand_type").text(house_hand_string);
            $("#house_c1").removeClass('flipped_card');
            $("#house_c2").removeClass('flipped_card');
            $("#house_c3").removeClass('flipped_card');
            $("#house_c1").text(house_hand[3][0]);
            $("#house_c2").text(house_hand[3][1]);
            $("#house_c3").text(house_hand[3][2]);
            $('#play').addClass('disabled');
            $('#fold').addClass('disabled');
            $('#reset').removeClass('disabled');
        }
        //evt.preventDefault();
    });

    //User clicks Fold button
    $('#fold').click(function(evt) {
        if (!($('#fold').hasClass('disabled'))) {
            game_state = 0;
            difference = stack - stack_snapshot;
            $("#stack_change").addClass("red_text");
            $("#stack_change").text(difference);
            new_hand();
            $('#play_ante').removeClass('disabled');
        }
    });

    //User clicks Reset button?
    $('#reset').click(function(evt) {
        if (!($('#reset').hasClass('disabled'))) {
            game_state = 0;
            $("#stack_change").text("");
            $("#stack_change").removeClass("green_text red_text yellow_text");
            $("#user_indicator").removeClass('winner loser');
            $('#house_indicator').removeClass('winner loser');
            new_hand();
        }
    });

    //+Ante
    $('#add_ante').click(function(evt) {
        if (!($('#add_ante').hasClass('disabled'))) {
            if (ante < 64) {
                ante += 4;
                $('#ante_amount').text("$" + ante + " Ante Bet");
            }
        }
    });

    //-Ante
    $('#minus_ante').click(function(evt) {
         if (!($('#minus_ante').hasClass('disabled'))) {
            if (ante > 4) {
                ante -= 4;
                $('#ante_amount').text("$" + ante + " Ante Bet");
            }
         }
    });

    //+Pair Plus
    $('#add_pair_plus').click(function(evt) {
        if (!($('#add_pair_plus').hasClass('disabled'))) {
            if (pair_plus < 64) {
                pair_plus += 4;
                $('#pair_plus_amount').text("$" + pair_plus + " Pair+ Bet");
            }
        }
    });

    //-Pair Plus
    $('#minus_pair_plus').click(function(evt) {
        if (!($('#minus_pair_plus').hasClass('disabled'))) {
            if (pair_plus > 0) {
                pair_plus -= 4;
                $('#pair_plus_amount').text("$" + pair_plus + " Pair+ Bet");
            }
        }
    });
});