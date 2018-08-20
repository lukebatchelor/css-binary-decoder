# CSS Binary Decoder

A binary decoder created using only CSS and HTML, no JavaScript™!

![](https://i.imgur.com/kidzWbU.png)

# Why?

After playing with a [proof of concept](https://codepen.io/hotmilo23/full/mqeVpo/) and building [tic-tac-toe](https://css-ttt.netlify.com/), I decided I'd like to show what else is possible by breaking ideas down into state machines and using nothing but CSS and HTML.

The plan is to use these projects as a part of a showcase that I can demo and teach at meetups/conferences.

Programming within an arbitrarily strict set of conditions is a fun puzzle to solve, and I think it could be interesting to others too.

# How does it work?

Similar to the tic tac toe code, this is very simple. There are **2048** `radio button`s on a page with 2048 `div`s next to them. The divs contain two labels, each of which points to another radio on the page.

All divs and radios are unchecked and hidden by default except the the "start" state. As you check each new radio (using their labels) it unchecks one radio and checks the next, thereby showing it's `div`.

All the important stuff is mainly achieved through two pieces of CSS.

```css
/* Hide all radios and states */
.state, input {
  display: none;
}

/* Only show a state if the radio next to it is checked */
input:checked + .state {
  display: block;
}
```

Which shows and hides states and:

```css
.answer::before {
  display: block;
  content: 'Binary: ' attr(data-bin);
}
.answer::after {
  display: block;
  content: 'Decimal: ' attr(data-dec);
}
```

Which reads the values for the state from [data attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*) and displays them as [::before and ::after](https://developer.mozilla.org/en-US/docs/Web/CSS/::before) elements.

The DOM looks something like this:

```html
<input type="radio" name="app-state" id="s1001">
<div class="state">
  <div class="answer" data-bin="1001" data-dec="9"></div>
  <label for="s10010">0</label>
  <label for="s10011">1</label>
</div>
```

The DOM/data is all created using a [simple script](./scripts/build-binary-decoder.js)

That's it!

---

Displaying larger binary number obviously requires more states, therefore, more DOM nodes.

To play with this, we also build multiple versions of the page. The following are built in each release

|Max Decimal |Link                                             |Size|
|------------|------------------------------------------------|-------|
|511         |[link](https://css-binary.netlify.com/8.html)   | 0.13mb|
|1023        |[link](https://css-binary.netlify.com/9.html)   | 0.26mb|
|2047        |[link](https://css-binary.netlify.com/)         | 0.52mb|
|4094        |[link](https://css-binary.netlify.com/11.html)  | 1.06mb|
|8191        |[link](https://css-binary.netlify.com/12.html)  | 2.15mb|
|16383       |[link](https://css-binary.netlify.com/12.html)  | 4.38mb|
|32767       |[link](https://css-binary.netlify.com/12.html)  | 8.90mb|

Bigger than this gets pretty slow to download and run, but feel free to run it yourself locally!
