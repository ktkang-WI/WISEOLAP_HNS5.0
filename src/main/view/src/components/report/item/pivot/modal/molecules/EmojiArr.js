const EmojiArr = Array.from({length: 32}, (_, index) => {
  const icon =
  require(`assets/image/icon/highlight/pivot_highlight_${index}.png`);
  return {icon, id: index};
});

export default EmojiArr;
