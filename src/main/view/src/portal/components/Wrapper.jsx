import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  background: white;
  /* reset */

  @font-face {
    font-family: 'NanumGothic';
    font-style: normal;
    font-weight: 400;
    src: url('../fonts/NanumBarunGothic.woff') format('woff'),
      url('../fonts/NanumBarunGothic.woff2') format('woff2');
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  enter,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    font-family: 'NanumGothic';

    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    font-size: 100%;
    vertical-align: baseline;
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    vertical-align: top;
  }

  ul,
  ol,
  li {
    list-style: none;
  }

  button {
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    text-align: left;
    cursor: pointer;
  }

  button:active {
    outline: none;
  }

  button:focus {
    outline: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  hr {
    border: none;
  }

  .blind {
    overflow: hidden;
    position: absolute;
    clip: rect(0, 0, 0, 0);
    width: 1px;
    height: 1px;
    margin: -1px;
  }

  .clearfix::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    font-size: 0;
    clear: both;
  }
  /* style */
    :root {
    --red: #d80028;
    --blue: #0066cc;

  }

  body {
    min-width: 1000px;
  }

  
  iframe {
    border: none;
  }

  .header_wrap {
    display: flex;
    align-items: center;
    max-width: 1820px;
    margin: 0 auto;
    padding: 35px 0;
    position: relative;
  }

  #header_menu {
    display: flex;
    align-items: center;
    margin-left: 70px;
  }

  #header_menu>li>a {
    display: inline-block;
    text-align: center;
    font-weight: bold;
    background-color: #fff;
    color: #000;
    padding: 10px 30px;
    font-size: 18px;
    border: 1px solid #bfbfbf;
    border-radius: 30px;
  }

  #header_menu>li>a.depth_a {
    position: relative;
    padding-right: 35px;

  }

  #header_menu>li>a.depth_a img {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }

  #header_menu>li {
    margin-right: 20px;
    position: relative;
  }

  #header_menu>li .depth_menu {
    position: absolute;
    left: 0;
    width: 100%;
    top: 100%;
    padding-top: 5px;
    z-index: 9;
    display: none;
    ;
  }

  #header_menu>li:hover>.depth_menu {
    display: block;
  }

  #header_menu>li:hover>a.depth_a img {
    transform: translateY(-50%) rotate(-180deg);
  }

  #header_menu>li .depth_menu ul {
    background-color: #fff;
    border: 1px solid #3679da;
    border-radius: 15px;
    padding: 13px 0;

  }

  #header_menu>li .depth_menu ul li a {
    display: block;
    text-align: center;
    font-size: 14px;
    color: #666666;
    padding: 4px 0;
    font-weight: bold;
  }

  #header_menu>li .depth_menu ul li a.active span {
    color: #3679da;
    border-bottom: 1px solid #3679da;
  }

  #header_menu>li:last-child {
    margin-right: 0;
  }

  #header_menu>li>a.active {
    background-color: #3679da;
    color: #fff;
    border-color: #3679da;
  }

  .menu_btn {
    position: fixed;
    width: 40px;
    height: 40px;
    background-color: #3679da;
    border-radius: 50%;
    right: 50px;
    top: 40px;
    z-index: 50;
  }

  .top_btn {
    top: auto;
    bottom: 50px;
    color: white;
    font-weight: bold;
    font-size: 20px;
    padding: 9px;
  }

  .menu_btn img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .contents {
    max-width: 1820px;
    margin: 0 auto;
  }

  .round_box {
    background-color: #fff;
    border: 2px solid #dddee6;
    border-radius: 25px;
    padding: 26px 35px;
  }

  .pay_box_wrap {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 45px;
  }

  .pay_box_wrap ul {
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 25px 0;

  }

  .pay_box_wrap .pay_box {
    flex: 1;
    background-color: #f3f4f8;
    border-radius: 20px;
    padding: 35px 25px;
    position: relative;
  }

  .pay_box_wrap li p {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 4px;
  }

  .pay_box_wrap li input,
  .pay_box_wrap li select {
    border: 0;
    border-radius: 50px;
    background-color: #dddee6;
    text-align: center;
    width: 100%;
    height: 45px;
    cursor: pointer;
  }

  .pay_box_wrap li input {
    background-image: url('../img/cal_ico.png');
    background-position: 90% 14px;
    background-repeat: no-repeat;
    font-family: 'NanumGothic';
    color: var(--red);
    font-size: 20px;
    font-weight: bold;
  }

  .pay_box_wrap li select {
    cursor: pointer;
    font-size: 16px;
    appearance: none;
    -webkit-appearance: none;
    background-image: url('../img/select_ico.png');
    background-position: 90% 18px;
    background-repeat: no-repeat;
    padding-right: 25px;
  }

  .pay_box_wrap li select option {
    cursor: pointer;
  }

  .pay_box_wrap li select option[value=""] {
    color: #999999;

  }

  .pay_box .pay_title {
    font-size: 24px;
    line-height: 1;
  }

  .pay_box .pay_title span {
    font-size: 16px;
  }

  .pay_box .pay {
    font-weight: bold;
    font-size: 45px;
  }

  .pay_box>div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pay_box>div:first-child {
    margin-bottom: 20px;
  }

  .pay_box>div:last-child {
    align-items: end;
  }

  .pay_box .percent_box p {
    font-size: 16px;
  }

  .pay_box .percent_box p:first-child {
    margin-bottom: 12px;
  }

  .pay_box .percent_box p span {
    font-size: 20px;
    font-weight: bold;
  }

  .pay_box .percent_box p span.red {
    color: var(--red);
  }

  .pay_box .percent_box p span.blue {
    color: var(--blue);
  }

  .graph_box_wrap {
    display: flex;
    align-items: stretch;
    gap: 30px;
    margin-bottom: 45px;

  }

  .graph_box_wrap .round_box {
    flex: 1;
  }

  .graph_tab {
    display: none;
  }

  .graph_box_wrap .round_box .graph_tab:first-of-type {
    display: block;
  }

  .graph_box_wrap .box_title {
    margin-bottom: 15px;
    display: flex;
    align-items: flex-end;
    position: relative;
  }

  .graph_box_wrap .box_title .box_title_btns {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
  }

  .graph_box_wrap .box_title .box_title_btns button {
    width: 120px;
    height: 35px;
    border-radius: 50px;
    text-align: center;
    color: #666666;
    font-size: 16px;
    background-color: #dddee6;
  }

  .graph_box_wrap .box_title .box_title_btns button.active {
    background-color: #000;
    color: #fff;
  }

  .graph_box_wrap .box_title .box_title_btns button:first-child {
    margin-right: 10px;
  }

  .graph_box_wrap .box_title span {
    font-weight: bold;
  }

  .graph_box_wrap .box_title img {
    margin-right: 10px;
  }

  .graph_box_wrap2 .graph_box {
    border: 2px solid #dddee6;
    position: relative;
    border-radius: 20px;
  }

  .graph_box_wrap2 .graph_box .line_title_box {
    position: absolute;
    left: 20px;
    top: -20px;
    font-weight: bold;
    font-size: 20px;
    background-color: #dddee6;
    padding: 8px 10px;
    border-radius: 50px;
  }

  .graph_box_wrap2 {
    display: flex;
    align-items: stretch;
    gap: 30px;
    padding-top: 35px;
    margin-bottom: 60px;
  }

  .graph_box_wrap2>div {
    flex: 1;
  }

  .graph_box_wrap2>div .graph_box:first-child {
    margin-bottom: 30px;
  }

  .blue_bg {
    background-color: #e5e9f2;
    padding: 65px 0;
  }

  .file_box>p {
    font-size: 30px;
    margin-bottom: 15px;
    text-align: left;
  }

  .file_box > p > img {
    height: 28px;
    margin-right: 10px;
    margin-top: 3px;
  }

  .file_box ul {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .file_box button {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #3679da;
    border-radius: 10px;
    padding: 25px 30px;
    display: flex;
    align-items: center;
  }

  .file_box button .txt p {
    font-weight: bold;
    font-size: 16px;
    color: #999999;
  }

  .file_box button .txt p:first-child {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
    color: black;
  }

  .file_box button .txt p img {
    height: 20px;
  }

  .file_box button .txt p:last-child {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }

  .file_box {
    margin-bottom: 56px;
  }

  .file_box:last-child {
    margin-bottom: 0;
  }

  @media (max-width:1900px) {
    .header_wrap {
      padding: 35px 20px;
    }

    .menu_btn {
      right: 20px;
    }

    .contents {
      padding: 0 20px;
    }

    #header_menu>li>a {
      font-size: 16px;
      padding: 10px 20px;
    }

    #header_menu>li {
      margin-right: 10px;

    }

    .pay_box .pay {
      font-size: 30px;
    }

    .pay_box .pay_title {
      font-size: 20px;
    }

    .pay_box_wrap li input {
      font-size: 18px;
    }

    .pay_box_wrap ul {
      width: 180px;
    }

    .pay_box_wrap .pay_box {
      padding: 25px 20px;
    }

    .pay_box_wrap {
      gap: 20px;
    }

    .graph_box_wrap2 .graph_box .line_title_box {
      font-size: 16px;
    }

    .graph_box_wrap2 .graph_box .line_title_box img {
      width: 18px;
      height: 18px;
      object-fit: contain;
    }

    .file_box button .txt p:first-child {
      font-size: 18px;
    }

    .file_box button {
      padding: 15px 20px;
    }

    .file_box button .txt p:last-child {
      font-size: 12px;
    }

    .file_box>p {
      font-size: 22px;
    }

    .round_box {
      padding: 18px 20px;
    }

    .graph_box_wrap2 {
      padding-top: 36px;
    }
  }

  @media (max-width:1400px) {

    .pay_box .pay_title {
      font-size: 16px;
    }

    .pay_box .pay_title span {
      font-size: 14px;
    }

    .pay_box .pay {
      font-size: 25px;
    }

    .pay_box .percent_box p span {
      font-size: 16px;
    }

    .pay_box .percent_box p {
      font-size: 15px;
    }

    .pay_box>div img {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }

    .pay_box_wrap li input {
      font-size: 14px;
      background-position: 90% 7px;
      background-size: 14px;

    }

    .pay_box_wrap li select {
      background-position: 90% 12px;
      background-size: 14px;
    }

    .pay_box_wrap li input,
    .pay_box_wrap li select {
      height: 30px;
    }

    .pay_box_wrap ul {
      padding: 10px 0;
    }

    .pay_box_wrap li p {
      font-size: 14px;
    }

    .graph_box_wrap .box_title .box_title_btns button {
      width: 100px;
    }

    .graph_box_wrap .box_title img {
      width: 30px;
    }

    .file_box button .txt p:first-child {
      font-size: 15px;
    }

    .file_box button .txt {
      margin-left: 15px;
    }

    #header_menu>li>a {
      font-size: 14px;
    }

    #header_menu>li {
      margin-right: 4px;
    }

    #header_menu {
      margin-left: 35px;
    }

    #logo img {
      width: 75px;
    }
  }

  @media (max-width:1200px) {
    .pay_box_wrap {
      flex-wrap: wrap;
    }

    .pay_box_wrap ul {
      width: 100%;
      flex-direction: row;
      justify-content: start;
    }

    .pay_box_wrap ul li:first-child {
      margin-right: 8px;
    }

    .pay_box_wrap ul li {
      width: 50%;
    }

    .pay_box_wrap li input,
    .pay_box_wrap li select {
      width: 100%;
    }

    .file_box ul li {
      height: 100%;
    }

    .file_box ul {
      grid-template-columns: repeat(3, 1fr);
    }

    .file_box button {
      height: 100%;
    }

    .graph_box_wrap .box_title .box_title_btns button {
      width: 80px;
      height: 30px;
      font-size: 14px;
    }
  }

  #portal_user_info {
    position: absolute;
    right: 30px;
  }

  #portal_user_info img {
    display: none;
  }

  .no-card {
    display: flex;
    align-items: center;
    text-align: center;
    width: 100%;
    justify-content: center;
    font-size: 18px;
  }

  .wise-filter {
    border: none;
    background: var(--round_box);
    border-radius: 25px !important;
    padding: 20px 25px !important;
    margin-bottom: 30px;
  }

  .board > div {
    background: white;
  }

  .swiper {
    width: 100%;
    height: 600px;
    margin-bottom: 50px;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

`;

export default Wrapper;
