"use strict";

let isPaused = false;  

const togglePause = () => {
    isPaused = !isPaused;  
    const pauseButton = document.querySelector(".icon i");
    pauseButton.className = isPaused ? "fa fa-play" : "fa fa-pause";
};

class Helper {
    constructor(time, list = []) {
        this.time = parseInt(400 / time);
        this.list = list;
    }

    checkPause = async () => {
        // Wait if paused
        while (isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100)); 
        }
    }

    mark = async (index) => {
        await this.checkPause();
        this.list[index].setAttribute("class", "cell current");
    }

    markSpl = async (index) => {
        await this.checkPause();
        this.list[index].setAttribute("class", "cell min");
    }

    unmark = async (index) => {
        await this.checkPause();
        this.list[index].setAttribute("class", "cell");
    }

    pause = async () => {
        await this.checkPause();
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, this.time);
        });
    }

    compare = async (index1, index2) => {
        await this.checkPause();
        await this.pause();
        let value1 = Number(this.list[index1].getAttribute("value"));
        let value2 = Number(this.list[index2].getAttribute("value"));
        return value1 > value2;
    }

    swap = async (index1, index2) => {
        await this.checkPause();
        await this.pause();
        let value1 = this.list[index1].getAttribute("value");
        let value2 = this.list[index2].getAttribute("value");
        this.list[index1].setAttribute("value", value2);
        this.list[index1].style.height = `${3.8 * value2}px`;
        this.list[index2].setAttribute("value", value1);
        this.list[index2].style.height = `${3.8 * value1}px`;
    }
}

class sortAlgorithms {
    constructor(time) {
        this.list = document.querySelectorAll(".cell");
        this.size = this.list.length;
        this.time = time;
        this.help = new Helper(this.time, this.list);
    }

    BubbleSort = async () => {
        for (let i = 0; i < this.size - 1; ++i) {
            for (let j = 0; j < this.size - i - 1; ++j) {
                await this.help.mark(j);
                await this.help.mark(j + 1);
                if (await this.help.compare(j, j + 1)) {
                    await this.help.swap(j, j + 1);
                }
                await this.help.unmark(j);
                await this.help.unmark(j + 1);
            }
            this.list[this.size - i - 1].setAttribute("class", "cell done");
        }
        this.list[0].setAttribute("class", "cell done");
    }

    InsertionSort = async () => {
        for (let i = 0; i < this.size - 1; ++i) {
            let j = i;
            while (j >= 0 && await this.help.compare(j, j + 1)) {
                await this.help.mark(j);
                await this.help.mark(j + 1);
                await this.help.pause();
                await this.help.swap(j, j + 1);
                await this.help.unmark(j);
                await this.help.unmark(j + 1);
                j -= 1;
            }
        }
        for (let counter = 0; counter < this.size; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

    SelectionSort = async () => {
        for (let i = 0; i < this.size; ++i) {
            let minIndex = i;
            for (let j = i; j < this.size; ++j) {
                await this.help.markSpl(minIndex);
                await this.help.mark(j);
                if (await this.help.compare(minIndex, j)) {
                    await this.help.unmark(minIndex);
                    minIndex = j;
                }
                await this.help.unmark(j);
                await this.help.markSpl(minIndex);
            }
            await this.help.mark(minIndex);
            await this.help.mark(i);
            await this.help.pause();
            await this.help.swap(minIndex, i);
            await this.help.unmark(minIndex);
            this.list[i].setAttribute("class", "cell done");
        }
    }

  

}

const start = async () => {
    let algoValue = Number(document.querySelector(".algo-menu").value);
    let speedValue = Number(document.querySelector(".speed-menu").value);

    if (speedValue === 0) {
        speedValue = 1;
    }
    if (algoValue === 0) {
        alert("No Algorithm Selected");
        return;
    }

    let algorithm = new sortAlgorithms(speedValue);
    try {
        if (algoValue === 1) await algorithm.BubbleSort();
        if (algoValue === 2) await algorithm.SelectionSort();
        if (algoValue === 3) await algorithm.InsertionSort();
        
    } catch (error) {
        if (error.message === "Sorting stopped") {
            console.log("Sorting was stopped.");
        } else {
            throw error; 
        }
    }
};

const RenderScreen = async () => {
    let algoValue = Number(document.querySelector(".algo-menu").value);
    await RenderList();
};

const RenderList = async () => {
    let sizeValue = Number(document.querySelector(".size-menu").value);
    await clearScreen();

    let list = await randomList(sizeValue);
    const arrayNode = document.querySelector(".array");
    for (const element of list) {
        const node = document.createElement("div");
        node.className = "cell";
        node.setAttribute("value", String(element));
        node.style.height = `${3.8 * element}px`;
        arrayNode.appendChild(node);
    }
};

const randomList = async (Length) => {
    let list = [];
    let lowerBound = 1;
    let upperBound = 100;

    for (let counter = 0; counter < Length; ++counter) {
        let randomNumber = Math.floor(
            Math.random() * (upperBound - lowerBound + 1) + lowerBound
        );
        list.push(parseInt(randomNumber));
    }
    return list;
};

const clearScreen = async () => {
    document.querySelector(".array").innerHTML = "";
};

const response = () => {
    let Navbar = document.querySelector(".navbar");
    if (Navbar.className === "navbar") {
        Navbar.className += " responsive";
    } else {
        Navbar.className = "navbar";
    }
};

document.querySelector(".icon").addEventListener("click", togglePause);
document.querySelector(".start").addEventListener("click", start);
document.querySelector(".size-menu").addEventListener("change", RenderScreen);
document.querySelector(".algo-menu").addEventListener("change", RenderScreen);

window.onload = RenderScreen;
