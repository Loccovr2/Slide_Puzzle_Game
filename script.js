const lv33 = document.getElementById("3x3");
const lv44 = document.getElementById("4x4");
const boardGame=document.querySelector('.board-game')
let currentLevel;


lv33.addEventListener("click", function(){buildGrid(3)});
lv44.addEventListener("click", function(){buildGrid(4)});


function buildGrid(p1){
      currentLevel=p1;
      boardGame.innerHTML = '';
      // Tạo n div.tile với id tile1,tile2,...tilen
      for (let i = 1; i < p1*p1; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile${i}`;
        // đánh số mỗi tile
        const label = document.createElement('span');
        label.className = 'tile-number';
        label.textContent = i;
        tile.appendChild(label);
        // Tạo thẻ img và gán src, alt
        const img = document.createElement('img');
        img.src = `sample_pic.jpg`;    
        // Bỏ img vào div.tile
        tile.appendChild(img);
        // Bỏ div.tile vào board-game
        boardGame.appendChild(tile);
      }
      boardGame.style.setProperty('--level', p1);

      setPositon(p1);
    };
function setPositon(p1){
    for(let i=0; i< p1 ; i++){
        for(let j=0; j <p1 ; j++){
        const idx= i * p1 + j + 1;
        const img = document.querySelector(`#tile${idx} img`);
        img.style.left     = `${-j * 100}%`;
        img.style.top      = `${-i * 100}%`;
        if(idx==(p1*p1)){
            img.style.display ='none';
        }
    }
}
}

// const merge = document.getElementById("merge")
// merge.addEventListener("click", function(){mergeTile(currentLevel)});
// function mergeTile(p1){
//     maxTop = (currentLevel-1)*100%;
//     maxLeft = (currentLevel-1)*100%;



    
// }



