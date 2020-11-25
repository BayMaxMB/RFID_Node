let ws = new WebSocket('ws://127.0.0.1:9898/');
let videoLink = "video/1.mp4";
let photoLink = "img/redheadphone.png";
let pricedata, taxdata, descriptiondata;
document.getElementById("video-btn").onclick = playvideo.bind(this, videoLink);
ws.onopen = () => {
	console.log('WebSocket Client Connected');
	ws.send('Message from web client.');
};
ws.onmessage = (msg) => {
	let data;
	try {
		data = JSON.parse(msg.data);
		pricedata = data["price"];
		taxdata = data["tax"];
		descriptiondata = data["description"];
		let buybtn = document.getElementById("buy-btn");
		buybtn.onclick = buy;
		buybtn.innerText = "Добавить в корзину";
		document.getElementsByClassName("pricer")[0].innerText = `Цена: `;

		Object.keys(data).forEach(prop => {
			if (data[prop]) {
				if (prop == "photo") {
					let photoElement = document.getElementById(prop);
					if(!photoElement)
						document.getElementsByClassName("left-column")[0].innerHTML = `<img class="active" src="${data[prop]}" alt="" id="photo">`;
					photoLink = data[prop];
					placeImg(data[prop]);
				}
				else if (prop == "video") {
					let videobtn = document.getElementById("video-btn");
					document.getElementById("video-btn").onclick = playvideo.bind(this, [data[prop]]);
					videoLink = data[prop];
				}
				else {
					document.getElementById(prop).innerHTML = data[prop];
				}
			}
		});
	} catch (e) {
		data = msg.data;
	}
	document.getElementsByTagName("main")[0].style.display = "flex";
	document.getElementsByClassName("mainpager")[0].style.display = "none";
};
function playvideo() {
	document.getElementsByClassName("left-column")[0].innerHTML = `<video
    id="my-video"
	controls
	autoplay
	loop
	muted="true">
    <source src="${videoLink}"" type="video/mp4" />
	</video>`;
	let btn = document.getElementById("video-btn");
	btn.innerText = "Фото";
	btn.onclick = placeImg.bind(this, [photoLink]);

}
function placeImg(link) {
	document.getElementsByClassName("left-column")[0].innerHTML = `<img class="active" src="${link}" alt="" id="photo">`;
	let btn = document.getElementById("video-btn");
	btn.innerText = "Видео";
	btn.onclick = playvideo.bind(this, videoLink);
}

function main() {
	document.getElementsByTagName("main")[0].style.display = "none";
	document.getElementsByClassName("mainpager")[0].style.display = "flex";
	placeImg(photoLink);
}
function buy() {
	document.getElementById("description").innerHTML = `
	<p >Цена: ${pricedata}</p>
	<p >Налог: 0</p>
	<div class="payments">
		<img src="img/payment/click.png"/>
		<img src="img/payment/payme.png"/>
		<img src="img/payment/apelsin2.png"/>
	</div>
	`;
	document.getElementsByClassName("pricer")[0].innerText = `Итого: `;
	let buybtn = document.getElementById("buy-btn");
	buybtn.innerText = `ОК`
	buybtn.onclick = makedesc; 
}

function makedesc() {
	document.getElementById("descriptor").innerHTML = `<p id="description">${descriptiondata}</p>`;
	let buybtn = document.getElementById("buy-btn");
	buybtn.innerText = `Добавить в корзину`
	buybtn.onclick = buy; 
}