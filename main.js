//-------------------------------------------------------------
// Declarations
//-------------------------------------------------------------

var DTP = DTP || {};

DTP.id = 'dt-html-player';
DTP.autoPlay = true; // TODO: implement this

DTP.player = null;
DTP.looping = false;
DTP.offset = null; // TODO: figure this shit out

DTP.inTime = 0;
DTP.outTime = 0;

DTP.$progress = null;
DTP.$progressBar = null;

DTP.$loopIn = null;
DTP.$loopOut = null;


//-------------------------------------------------------------
// Control
//-------------------------------------------------------------
DTP.timeToPosition = function (time) {
	return Math.round((time / DTP.player.duration) * DTP.$progressBar.width());
};

DTP.positionToTime = function (position) {
	return ((position) / DTP.$progressBar.width()) * DTP.player.duration;
};

DTP.seek = function (time) {
	DTP.$progress.css('width', DTP.timeToPosition(time));
	DTP.player.currentTime = time;
};

DTP.placeMarker = function (marker, position) {
    
};


//-------------------------------------------------------------
// Event Listeners
//-------------------------------------------------------------

// ---------- DOM listeners ----------

DTP.onReady = function (event) {
	var player;
	var $player;
	
	console.log('onready');
	
	$player = $('#' + DTP.id);
	
	DTP.player = player = $player[0];
	DTP.$progress = $('#progress-bar div');
	DTP.$progressBar = $('#progress-bar');
	DTP.offset = parseInt(DTP.$progress.css('margin-left'));
	
	DTP.$loopIn = $('div#dt-loop-in.marker');
	DTP.$loopOut = $('divdt-loop-out.marker');
	
	player.volume = 0; // TODO: uncomment on deploy
	
	// Video events
	$player.bind('playing', DTP.onPlaying);
	$player.bind('pause', DTP.onPause);
	$player.bind('ended', DTP.onEnded);
	
	// Control events
	$('#play-pause').bind('click', DTP.onPlayPauseClick);
	$('#toggle-loop').bind('click', DTP.onToggleLoopClick);
	$('#progress-bar').bind('click', DTP.onProgressBarClick);
	$('#progress-bar').bind('contextmenu', DTP.onProgressBarContextMenu);
};


// ---------- Video listeners ----------

DTP.onPlaying = function (event) {
	var $player = $(event.target);
	
	console.log('#dt-html-player playing');
	
	$player.bind('timeupdate', DTP.onTimeUpdate);
};

DTP.onPause = function (event) {
	var $player = $(event.target);
	
	console.log('#dt-html-player pause');
	
	$player.unbind('timeupdate');
};

DTP.onTimeUpdate = function (event) {
	var player = event.target;
	
	//console.log('#dt-html-player timeupdate (' + player.currentTime + ')');
	
	DTP.$progress.css('width', DTP.timeToPosition(player.currentTime));
};

DTP.onEnded = function (event) {
	var player = DTP.player;
	var $player = $(player);
	var $button = $('#play-pause');
	
	console.log(DTP.id + ' ended');
	
	$player.bind('pause', function () {
		$button.removeClass('playing', event.handleObj);
		$player.unbind('pause');
	});
	
	player.pause();
};

// ---------- Control listeners ----------

DTP.onPlayPauseClick = function (event) {
	var player = DTP.player;
	var $player = $(player);
	var $button = $('#play-pause');
	
	console.log('#play-pause click');
	
	if (player.paused) {
		$player.bind('playing', function () {
			$button.addClass('playing');
			$player.unbind('playing', event.handleObj);
		});
		player.play();
	} else {
		$player.bind('pause', function () {
			$button.removeClass('playing', event.handleObj);
			$player.unbind('pause');
		});
		player.pause();
	}
	
	return false;
};

DTP.onToggleLoopClick = function (event) {
	var $button = $('#toggle-loop');
	
	console.log('#toggle-loop click');
	
	if (DTP.looping) {
		DTP.looping = false;
		$button.removeClass('looping');
	} else {
		DTP.looping = true;
		$button.addClass('looping');
	}
	
	return false;
};

DTP.onProgressBarClick = function (event) {
	DTP.seek(DTP.positionToTime(event.offsetX));
	return false;
};

DTP.onProgressBarContextMenu = function (event) {
    var position = event.offsetX;
    var inTime = DTP.inTime;
    var outTime = DTP.outTime;
    
    var $loopIn = DTP.$loopIn;
    var $loopOut = DTP.$loopOut;
    
	console.log('#progress-bar contextmenu (' + position + ')');
	
	if (inTime === 0 && outTime === 0) {
	    console.log('no markers, placing [in]');
	    
	} else if (){
	    
	}
	
	//.css('left', DTP.$progressBar.offset().left + position)
	
	return false;
};

$(document).ready(DTP.onReady);