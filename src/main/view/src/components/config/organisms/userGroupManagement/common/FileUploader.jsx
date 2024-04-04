import {useCallback, useState} from 'react';
import FileUploader
  from 'devextreme-react/file-uploader';
import ProgressBar from 'devextreme-react/progress-bar';
import styled from 'styled-components';

const allowedFileExtensions = ['.jpg', '.jpeg', '.gif', '.png'];

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FileUploadContainer = styled(Container)`
  & > span {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
  }
`;

const DropZoneText = styled(Container)`
  & > span {
    font-weight: 100;
    opacity: 0.5;
  }
`;

const DropZoneImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const DropZoneExternal = styled(Container)`
  width: 100%;
  height: 100px;
  background-color: rgba(183, 183, 183, 0.1);
  border-width: 2px;
  border-style: dashed;
  padding: 10px;
  & > * {
    pointer-events: none;
  }

  & + .dropzone-active {
    border-style: solid;
  }
`;

const CusTomFileUploader = ({defaultImage, title, id}) => {
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [imageSource, setImageSource] = useState(defaultImage);
  const [textVisible, setTextVisible] = useState(true);
  const [progressVisible, setProgressVisible] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [mainTitle] = useState(title ? title: 'Title');
  const [setId] = useState(id ? id: 'dumyId');

  const onDropZoneEnter = useCallback(
      (e) => {
        if (e.dropZoneElement.id === setId) {
          setIsDropZoneActive(true);
        }
      },
      [setIsDropZoneActive],
  );
  const onDropZoneLeave = useCallback(
      (e) => {
        if (e.dropZoneElement.id === setId) {
          setIsDropZoneActive(false);
        }
      },
      [setIsDropZoneActive],
  );
  const onUploaded = useCallback(
      (e) => {
        const {file} = e;
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setIsDropZoneActive(false);
          setImageSource(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        setTextVisible(false);
        setProgressVisible(false);
        setProgressValue(0);
      },
      [
        setImageSource,
        setIsDropZoneActive,
        setTextVisible,
        setProgressVisible,
        setProgressValue
      ]
  );
  const onProgress = useCallback(
      (e) => {
        setProgressValue((e.bytesLoaded / e.bytesTotal) * 100);
      },
      [setProgressValue],
  );
  const onUploadStarted = useCallback(() => {
    setImageSource('');
    setProgressVisible(true);
  }, [setImageSource, setProgressVisible]);

  return (
    <FileUploadContainer>
      <span>{mainTitle}</span>
      <DropZoneExternal
        id={setId}
        className={`${
          isDropZoneActive ?
            'dx-theme-accent-as-border-color dropzone-active' :
            'dx-theme-border-color'
        }`}
      >
        {imageSource && (
          <DropZoneImage
            src={imageSource}
            alt=""
          />
        )}
        {textVisible && (
          <DropZoneText
          >
            <span>{mainTitle} 이미지 업로드</span>
          </DropZoneText>
        )}
        <ProgressBar
          min={0}
          max={100}
          width="30%"
          showStatus={false}
          visible={progressVisible}
          value={progressValue}
        ></ProgressBar>
      </DropZoneExternal>
      <FileUploader
        dialogTrigger={'#'+setId}
        dropZone={'#'+setId}
        multiple={false}
        allowedFileExtensions={allowedFileExtensions}
        uploadMode="instantly"
        uploadUrl="http://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
        visible={false}
        onDropZoneEnter={onDropZoneEnter}
        onDropZoneLeave={onDropZoneLeave}
        onUploaded={onUploaded}
        onProgress={onProgress}
        onUploadStarted={onUploadStarted}
      ></FileUploader>
    </FileUploadContainer>
  );
};

export default CusTomFileUploader;
