---
layout: home

hero:
  name: machinable
  text: research code
  tagline: A modular system to manage research code effectively so you can move quickly while enabling reuse and collaboration.
  image:
    src: /logo/logo.png
    alt: machinable-logo
  actions:
    - theme: brand
      text: Get Started
      link: /tutorial/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/machinable-org/machinable

features:
  - icon: 🛠️
    title: Unified representation
    details: Run code and inspect results using the same abstraction. Check out the example below ⏬
  - icon: ⚡️
    title: Designed for rapid iteration
    details: Spend more time experimenting while relying on machinable to keep things organized.
  - icon: 💡
    title: Hackable and interactive
    details: Tweak, extend, override while leveraging first-class support for Jupyter as well as the CLI. 
---


<br />

<br />

<br />

<br />


<section id="pitch">

  <div class="container">
    <div class="top">
      <span class="first dot"></span>
      <span class="second dot"></span>
      <span class="third dot"></span>
      &nbsp; 💻
    </div>

  <div class="content">

  ::: info  Some research code

  Running code ...

  `python regression.py --rate=0.1 --logs=1 --name=run-01`

  ... and loading the corresponding results ...

  `python plot_regression_result.py --experiment=run-01`

  ... are distinct and often redundant.

  This means you have to manually keep track by remembering what the experiment with `rate=0.1` was called.

  :::

  <br />

  ::: tip machinable research code

  Running code ...

  `machinable regression rate=0.1 logs_=True --launch`

  ... and loading the corresponding results ...

  `machinable regression rate=0.1 logs_=True --launch --plot`

  ... are distinct but use the same abstraction.
  
  This means no need to worry about names as machinable automatically keeps track if you ran `rate=0.1` before.

  :::

  <br />

  :arrow_right: [Learn more about machinable's approach](./about/approach.md)

  </div>

</div>

</section>

<br />
<br />
<br />

<img src="/logo/logo.png" style="width:64px; margin: 0 auto;" alt="logo" />

  
<style scoped>
section {
  padding: 42px 32px;
}
#pitch {
  max-width: 960px;
  margin: 0px auto;
  color: var(--vt-c-text-2);
}
#pitch h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10% 5% 5% 5%;
}

.dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
}

.first {
  background-color: #ff3b47;
  border-color: #9d252b;
}

.second {
  background-color: #ffc100;
  border-color: #9d802c;
}

.third {
  background-color: #00d742;
  border-color: #049931;
}

.container {
  border: 3px solid #f1f1f1;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.top {
  padding: 10px;
  background: #f1f1f1;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.content {
  padding: 5%;
}
</style>
