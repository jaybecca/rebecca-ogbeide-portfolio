
const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            const counter = entry.target;

            const target = Number(counter.dataset.target);

            let current = 0;

            const timer = setInterval(()=>{

                current += Math.ceil(target / 100);

                if(current >= target){

                    counter.textContent = target;

                    clearInterval(timer);

                }else{

                    counter.textContent = current;

                }

            },20);

            observer.unobserve(counter);

        }

    });

});

counters.forEach(counter=>observer.observe(counter));