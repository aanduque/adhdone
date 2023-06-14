import { addAction, addFilter, applyFilters } from "@wordpress/hooks";
import confetti from "canvas-confetti";
import { isNull } from "lodash";

export const registerTitleMatcher = (name: string, regex, handler: () => void, hideOnView: boolean = true) => {

  addFilter('task.matchers', 'core', (matchers) => {

    matchers.push({
      name,
      regex,
      handler,
      hideOnView,
    })

    return matchers

  })

}

export default () => {

  console.log('Initializing default hooks...')

  addFilter("task.labels", "integration/chatwoot", (content, task, session) => {

    const tag = task?.integration === "chatwoot"
      ? `<a title="View in Chatwoot" href="${task?.url}" target="_blank"><img src="https://pbs.twimg.com/profile_images/1423652984211214336/jCONMrqn_400x400.jpg" class="h-3.5 w-3.5"></a>`
      : "";
    return `${tag} ${content}`
  }, 20);

  /** Register the linear matcher */
  registerTitleMatcher('linear', /([A-Z]{3,}-\d{2,})/, (match, regex, title, task, group) => {

    task.url = `https://linear.app/nextpress/issue/${match}`
    task.integration = 'linear'

  }, true)

  /** Register the Chatwoot matcher */
  registerTitleMatcher('chatwoot', /CW-(\d{2,})/, (match, regex, title, task, group) => {

    task.url = `https://support.delta.nextpress.co/app/accounts/1/conversations/${match}`
    task.integration = 'chatwoot'

  }, true)

  const matchRules = applyFilters('task.matchers', []);

  console.log(matchRules)

  addAction('task.process.title', 'core', (title, task, group) => {

    matchRules.forEach(matcher => {

      const {name, regex, handler, hideOnView} = matcher

      if (regex.test(title)) {

        console.log(`Matched matcher ${name}`)

        const matches = title.match(regex)

        handler(matches[1], regex, title, task, group)

      }

    });

  })

  addFilter('task.process.title.view', 'core', (title, task, group) => {

    if (isNull(title)) {
      return title
    }

    matchRules.forEach(matcher => {

      const { name, regex, handler, hideOnView } = matcher

      if (regex.test(title) && hideOnView) {

        const matches = title.match(regex)

        console.log(`Matched matcher ${name} with:`, matches[0], title, title.replace(matches[0], '').trim())

        return title.replace(matches[0], '').trim()

      }

    });

    return title

  });

  addAction("task.completed", "core", (task, group) => {
    console.log('Confetti!')

    // do this for 30 seconds
    var duration = 2 * 1000;
    var end = Date.now() + duration;

    (function frame() {

      const colors = [
        "#1abc9c",
        "#3498db",
        "#9b59b6",
        "#34495e",
        "#f1c40f",
        "#e67e22",
        "#e74c3c",
        "#95a5a6",
        "#8e44ad",
        "#2c3e50",
        "#2980b9",
        "#27ae60",
        "#16a085",
        "#f39c12",
      ];

      // launch a few confetti from the left edge
      confetti({
        colors,
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      // and launch a few from the right edge
      confetti({
        colors,
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      // keep going until we are out of time
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // confetti({
    //   particleCount: 300,
    //   colors: [
    //     "#1abc9c",
    //     "#3498db",
    //     "#9b59b6",
    //     "#34495e",
    //     "#f1c40f",
    //     "#e67e22",
    //     "#e74c3c",
    //     "#95a5a6",
    //     "#8e44ad",
    //     "#2c3e50",
    //     "#2980b9",
    //     "#27ae60",
    //     "#16a085",
    //     "#f39c12",
    //   ],
    //   spread: 70,
    //   origin: { y: 0.4 },
    // });
  });
};
