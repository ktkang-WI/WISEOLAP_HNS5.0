import {styled} from 'styled-components';
import SmallImageButton from
  'components/common/atomic/Common/Button/SmallImageButton';

const ItemTitleText = styled(SmallImageButton)`
  img {
    opacity: 0.5;

    &:hover {
      opacity: 1.0;
    }
  }
`;

export default ItemTitleText;
