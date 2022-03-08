import React, { useState } from 'react';

type Props = {
  InputComponent: any;
  isNumerical?: boolean;
  properties: object;
  text?: string;
  updateText: (text: string) => void;
};
const DebouncedInput = (props: Props) => {
  const {
    InputComponent,
    isNumerical,
    properties,
    updateText,
    text: inputText
  } = props;

  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [text, setText] = useState<string>(inputText || '');

  if (!inputText && text !== '' && !typingTimeout) {
    setText('');
  }

  const handleTextChange = (e: any) => {
    const { value } = e.target;

    if (isNumerical) {
      const re = /^[0-9\b]+$/;
      if (value === '' || re.test(value.trim())) {
        setText(value.trim());
        clearTimeout(typingTimeout);
        setTypingTimeout(
          setTimeout(() => {
            updateText(value.trim());
            setTypingTimeout(null);
          }, 500)
        );

        return;
      }
    }

    setText(value);
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        updateText(value.trim());
        setTypingTimeout(null);
      }, 500)
    );
  };

  return (
    <InputComponent {...properties} onChange={handleTextChange} value={text} />
  );
};

DebouncedInput.defaultProps = {
  isNumerical: false,
  text: ''
};

export default DebouncedInput;
