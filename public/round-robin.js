document.addEventListener('DOMContentLoaded', () => {
    let nameList = "Alex,Ben R,Ben W,Chris,Dan,Emily,Fiona,Grace,Hannah,Ian,James,Karen,Liam,Noah,Olivia,Parker,Quinn,Rachel".split(",");
    const urlParams = new URLSearchParams(window.location.search);
    const names = urlParams.get('names');
    if(names) {
        nameList = names.split(",");
    }


    const containerSize = 500;
    const radius = 210;
    const smallCircleSize = 80;
    const delay = 50;

    let availableNames = fisherYatesShuffle([...nameList]);
    let skippedNames = [];
    let selectedName = '';
    let spinning = false;
    let currentIndex = 0;

    const app = document.getElementById('app');

    function fisherYatesShuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function render() {
        app.innerHTML = `
            <div class="text-center mt-5">
                <h1>UpNext <span class="for-teams">for teams</span></h1>
                <h5>Random turns, organized updates.</h5>
                <p>With UpNext, teams can share updates at random or select members manually, making it easy to keep track of who has provided an update.</p>
                <div class="mt-5" style="position: relative; width: ${containerSize}px; height: ${containerSize}px; margin: 0 auto;">
                    <div class="d-flex flex-column inner-circle ${spinning ? '' : 'expand'}" id="inner-circle">
                        ${getInnerCircleLabel()}
                    </div>
                    ${availableNames.map((name, index) => `
                        <div class="outer-circle ${index === currentIndex ? 'active' : ''}"
                             style="${getCircleStyle(name, index)}"
                             data-index="${index}">
                            ${name}
                        </div>`).join('')}
                </div>
                <div class="mt-5" style="margin-top: 20px;">
                    <a href="#" class="btn-link-off" id="reset">Reset</a>
                </div>
            </div>
        `;

        document.getElementById('inner-circle').addEventListener('click', spinWheel);
        document.querySelectorAll('.outer-circle').forEach(circle => {
            circle.addEventListener('click', (event) => {
                const index = parseInt(event.target.dataset.index, 10);
                onSelectName(availableNames[index], index);
            });
        });
        document.getElementById('reset').addEventListener('click', (event) => {
            event.preventDefault();
            onRestart();
        });
    }

    function getCircleStyle(name, index) {
        const angle = (index / availableNames.length) * 2 * Math.PI;
        const x = containerSize / 2 + radius * Math.cos(angle) - smallCircleSize / 2;
        const y = containerSize / 2 + radius * Math.sin(angle) - smallCircleSize / 2;

        const backgroundColor = spinning && index === currentIndex
            ? '#4CBB17'
            : skippedNames.includes(name)
                ? '#fff'
                : '#004B87';
        const color = spinning && index === currentIndex
            ? '#fff'
            : skippedNames.includes(name)
                ? '#333'
                : '#fff';

        return `left: ${x}px; top: ${y}px; color: ${color}; background-color: ${backgroundColor};`;
    }

    function getInnerCircleLabel() {
        if (!selectedName && skippedNames.length > 0) {
            return 'Resume';
        }
        if (!selectedName && availableNames.length === skippedNames.length) {
            return 'Start Over';
        }
        if (spinning) {
            return 'Searching...';
        }
        return selectedName || 'Start';
    }

    function spinWheel() {
        if (availableNames.length === skippedNames.length) {
            onRestart();
            return;
        }

        spinning = true;
        const totalNames = availableNames.length;
        const fullRounds = totalNames;
        const extraSteps = Math.floor(Math.random() * totalNames);
        const totalSteps = fullRounds + extraSteps;

        let step = 0;
        let nextIndex = currentIndex;

        const interval = setInterval(() => {
            do {
                nextIndex = (nextIndex + 1) % totalNames;
            } while (skippedNames.includes(availableNames[nextIndex]));

            currentIndex = nextIndex;
            render();

            if (++step === totalSteps) {
                clearInterval(interval);
                spinning = false;
                selectedName = availableNames[nextIndex];
                skippedNames.push(selectedName);
                render();
            }
        }, delay);
    }

    function onRestart() {
        availableNames = fisherYatesShuffle([...nameList]);
        skippedNames = [];
        selectedName = '';
        spinning = false;
        currentIndex = 0;
        render();
    }

    function onSelectName(name) {
        if (skippedNames.includes(name)) {
            skippedNames = skippedNames.filter(n => n !== name);
            selectedName = '';
        } else {
            selectedName = name;
            skippedNames.push(name);
        }
        render();
    }

    render();
});
