import {Outlet, useLocation} from 'react-router';
import {CSSTransition, SwitchTransition} from 'react-transition-group';

/**
 * 페이지 전환 Transition 애니메이션 적용.
 * @return {SwitchTransition}
 */
const PagingTransition = () => {
  const location = useLocation();
  return (
    <SwitchTransition>
      <CSSTransition
        key={location.pathname}
        timeout={300}
        classNames="page"
        unmountOnExit
      >
        <Outlet/>
      </CSSTransition>
    </SwitchTransition>
  );
};
export default PagingTransition;
