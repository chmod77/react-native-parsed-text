import React, { useRef, useEffect, useState } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import TextExtraction from './lib/TextExtraction';

const ParsedText = (props) => {
  const [parsedText, setParsedText] = useState(null);
  const _root = useRef(null);

  useEffect(() => {
    const getPatterns = () => {
      if (!props.parse) return [];
      return props.parse.map((option) => {
        const { type, ...patternOption } = option;
        if (type) {
          if (!PATTERNS[type]) {
            throw new Error(`${option.type} is not a supported type`);
          }
          patternOption.pattern = PATTERNS[type];
        }
        return patternOption;
      });
    };

    const getParsedText = () => {
      if (!props.parse || typeof props.children !== 'string') {
        return props.children;
      }

      const textExtraction = new TextExtraction(props.children, getPatterns());

      return textExtraction.parse().map((props, index) => {
        const { style: parentStyle } = props;
        const { style, ...remainder } = props;
        return (
          <Text
            key={`parsedText-${index}`}
            style={[parentStyle, style]}
            {...props.childrenProps}
            {...remainder}
          />
        );
      });
    };

    setParsedText(getParsedText());
  }, [props]);

  // Discard custom props before passing remainder to Text
  const { parse, childrenProps, ...remainder } = props;

  return (
    <Text ref={_root} {...remainder}>
      {parsedText}
    </Text>
  );
};

ParsedText.propTypes = {
  ...Text.propTypes,
  parse: PropTypes.arrayOf(
    PropTypes.oneOfType([defaultParseShape, customParseShape]),
  ),
  childrenProps: PropTypes.shape(Text.propTypes),
};

ParsedText.defaultProps = {
  parse: null,
  childrenProps: {},
};

ParsedText.displayName = 'ParsedText';

export default ParsedText;
