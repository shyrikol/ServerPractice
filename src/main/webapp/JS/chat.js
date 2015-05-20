'use strict';

var uniqueId = function() {
	var date = Date.now();
	var random = Math.random();

	return Math.floor(random).toString();
};

var theTask = function(user, text) {
	return {
		user:user,
		message:text,
		id: uniqueId()
	};
};
	

var user=restoreUser() || '';
var temp;
var editVal='';
var count =0;

var appState = {
	mainUrl : 'WebChatApplication',
	taskList:[],
	token : 'TE11EN'
};


function run(){
	document.getElementById('errorblock').style.display = "none";
	var appContainer = document.getElementsByClassName('todos')[0];
	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);

	restore();
}

function createAllTasks(allTasks) {
	for(var i = 0; i < allTasks.length; i++){
		addTodoInternal(allTasks[i]);
	}
}

function createOneTask(allTasks) {
	addTodoInternal(allTasks[allTasks.length-1]);
}

function delegateEvent(evtObj) {

	if(evtObj.type === 'click' && evtObj.target.classList.contains('btn-add')){
		onAddButtonClick(evtObj);
	}
	if(evtObj.type === 'click' && evtObj.target.classList.contains('btn-send')){
		onSendButtonClick(evtObj);
	}
	if(evtObj.type === 'click' && evtObj.target.classList.contains('btn-error')){
		onErrorButtonClick(evtObj);
	}
	if(evtObj.type === 'click' && evtObj.target.classList.contains('image-click')){
		onToggleItem(evtObj.target.parentElement);
	}
	if(evtObj.type === 'click' && evtObj.target.classList.contains('button-click')){
		onDivButtonClick(evtObj.target.parentElement);
	}
}

function onAddButtonClick(){

	if (user==''){
		user = document.getElementById('todoText').value;
		store(user);
	}
	user = document.getElementById('todoText').value;
	document.getElementById('leftuser').innerHTML = user;
	store(user);
}

function onSendButtonClick(){
    var todoText = document.getElementById('inputText');
	var newTask = theTask(user, todoText.value);

	if(todoText.value == '')
		return;

	todoText.value = '';
	addTodo(newTask, function() {
		updateCounter();
	});
}

function onErrorButtonClick(){
    if (document.getElementById('errorblock').style.display == "none"){
    	document.getElementById('errorblock').style.display = "block"
    }
	else{
		document.getElementById('errorblock').style.display == "none"
	}
}


function onDivButtonClick(divItem){
	var id = divItem.attributes['data-task-id'].value;
	var taskList = appState.taskList;

	for(var i = 0; i < taskList.length; i++) {
		if(taskList[i].id != id){
			continue;
		}
		editDescription(taskList[i]);

		togglePost(taskList[i], function() {
			updateItem(divItem, taskList[i]);
		});

		return;
	}
}

function toggle(task, continueWith) {
	del(appState.mainUrl, JSON.stringify(task), function() {
		continueWith && continueWith();
	});
}

function togglePost(task, continueWith) {
	put(appState.mainUrl, JSON.stringify(task), function() {
		continueWith && continueWith();
	});
}

function editDescription(task){
	if (document.getElementById('inputText').value==''){
		alert('Input field was empty, so you edited to an empty line')
	}
	task.message =document.getElementById('inputText').value;
}

function onToggleItem(divItem) {
	var id = divItem.attributes['data-task-id'].value;
	var taskList = appState.taskList;

	for(var i = 0; i < taskList.length; i++) {
		if(taskList[i].id != id){
			continue;
		}
        if (taskList[i].user==user) {
            changeDescription(taskList[i]);
        }
        else{
            alert('You can delete only your own messages!');
            return;
        }
		toggle(taskList[i], function() {
			updateItem(divItem, taskList[i]);
		});

		return;
	}
}


function addTodo(task, continueWith) {
	post(appState.mainUrl, JSON.stringify(task), function(){
		restore();
	});
}

function addTodoInternal(task) {
	var item = createItem(task);
	var items = document.getElementsByClassName('items')[0];
	var taskList = appState.taskList;

	taskList.push(task);
	items.appendChild(item);
}

function createItem(task){
	temp = document.createElement('div');
	var htmlAsText = '<div data-task-id="идентификатор">'+
	'<img class="image-click" src="images/delete.png" style="cursor:pointer"><button class="button-click">Edit</button>описание задачи</div>';

	temp.innerHTML = htmlAsText;
	updateItem(temp.firstChild, task);

	return temp.firstChild;
}


function updateItem(divItem, task){
	divItem.setAttribute('data-task-id', task.id);
	if (divItem.childNodes[1].value=='')
	divItem.lastChild.textContent = task.user+" : "+task.message;
	else{
	divItem.lastChild.textContent = divItem.childNodes[1].value;
	task.user=divItem.childNodes[1].value;
	divItem.lastChild.textContent =task.user+" : "+task.message;
}
}

function changeDescription(task){
	task.message= 'Message was deleted';
}

function updateCounter(){
	var items = document.getElementsByClassName('items')[0];
	var counter = document.getElementsByClassName('counter-holder')[0];
}

function store(NameToSave) {

	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	alert(NameToSave);
	localStorage.setItem("TODOs nameList", JSON.stringify(NameToSave));
}

function restore(continueWith) {
	var url = appState.mainUrl + '?token=' + appState.token;
		count++;

	get(url, function(responseText) {
		console.assert(responseText != null);

		var response = JSON.parse(responseText);

		appState.token = response.token;
		if (count==1)
			createAllTasks(response.messages);
		if (count!=1)
			createOneTask(response.messages);
		updateCounter();

		continueWith && continueWith();
	});
}


function restoreUser() {

	var item = localStorage.getItem("TODOs nameList");

	return item && JSON.parse(item);
}

function ajax(method, url, data, continueWith, continueWithError) {
	var xhr = new XMLHttpRequest();

	continueWithError = continueWithError || defaultErrorHandler;
	xhr.open(method || 'GET', url, true);

	xhr.onload = function () {
		if (xhr.readyState !== 4)
			return;

		if(xhr.status != 200) {
			continueWithError('Error on the server side, response ' + xhr.status);
			return;
		}

		if(isError(xhr.responseText)) {
			continueWithError('Error on the server side, response ' + xhr.responseText);
			return;
		}

		continueWith(xhr.responseText);
	};    

    xhr.ontimeout = function () {
    	ontinueWithError('Server timed out !');
    }

    xhr.onerror = function (e) {
    	var errMsg = 'Server connection error !\n'+
    	'\n' +
    	'Check if \n'+
    	'- server is active\n'+
    	'- server sends header "Access-Control-Allow-Origin:*"';

        continueWithError(errMsg);
    };

    xhr.send(data);
}

function defaultErrorHandler(message) {
	console.error(message);
}

function get(url, continueWith, continueWithError) {
	ajax('GET', url, null, continueWith, continueWithError);
}

function post(url, data, continueWith, continueWithError) {
	ajax('POST', url, data, continueWith, continueWithError);	
}

function put(url, data, continueWith, continueWithError) {
	ajax('PUT', url, data, continueWith, continueWithError);	
}
function del(url, data, continueWith, continueWithError) {
    ajax('DELETE', url, data, continueWith, continueWithError);
}

function isError(text) {
	if(text == "")
		return false;
	
	try {
		var obj = JSON.parse(text);
	} catch(ex) {
		return true;
	}

	return !!obj.error;
}

