import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {useEffect, useRef} from 'react';
import QueryEditor from './QueryEditor';

const ShowQueryEditor = ({datasetQuery}) => {
  const queryEditorRef = useRef();
  useEffect(() => {
    if (!_.isEmpty(queryEditorRef.current)) {
      queryEditorRef.current.editor.setValue(datasetQuery);
    }
  }, [queryEditorRef]);

  return (
    <Wrapper
      padding={'5px'}
    >
      <QueryEditor
        editorRef={queryEditorRef}
        value={queryEditorRef.current &&
          queryEditorRef.current.editor.getValue()}
        readOnly={true}
      />
    </Wrapper>
  );
};

export default React.memo(ShowQueryEditor);
