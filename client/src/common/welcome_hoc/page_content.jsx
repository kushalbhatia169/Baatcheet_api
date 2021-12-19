import React from 'react';
import { Box } from '@mui/material';
import Whoweare from '../../images/Whoweare.png';
import privacy from '../../images/privacy.jpg';

const PageContent = () => {
  return (
    <Box className="welcome-page-content">
      <Introduction />
      <WhyBC />
    </Box>
  );
};

const Introduction = () => {
  return <Box className="welcome-page-content__intro d-flex align-items-center flex-column mt-5">
    <Box>
      <h2 className="heading active">Who are we?</h2>
    </Box>
    <Box className="d-flex align-items-center flex-column mt-2 welcome-page-content__intro__content">
      <h3>Our Motto!</h3>
      <h1>Your Privacy</h1>
    </Box>
    <Box className="ms-4 mt-2 p-3 d-flex">
      <Box className="me-2 w-50 p-1 mt-3 p_box d-flex align-items-center">
        <p className="me-1">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi,
            repellendus ea? Earum, consectetur! Dolorum quisquam accusantium illum
            dolorem eius iure adipisci, mollitia unde. Aliquid asperiores perspiciatis,
            facere odio iure eaque.
        </p>
      </Box>
      <img className="w-50 mt-3" src={Whoweare} alt="whoarewe" />
    </Box>
  </Box>;
};

const WhyBC = () => {
  const whyBC_Content = [
    { title: 'Secure', content: 'BC!\'s are heavily encrypted and can self-destruct.',
      image: 'https://lh3.googleusercontent.com/proxy/EVG57r8Q_qPIvIdQlV72XDyH_uTzT2ItWk_vVF-' +
      '1tqNbto9Y8_C8nJNMkAsGhadymCajqlVgUHlFWkDptGEBNHKanj3gUtURY6b65gLaq4CodHo' },
    { title: 'Simple', content: 'BC! is so simple you already know how to use it.',
      image: 'https://stickershop.line-scdn.net/stickershop/v1/product/3675615/LINEStorePC/main.png;compress=true' },
    { title: 'Privacy', content: 'BC! can done between you and your friend only.', image: privacy },
    { title: 'Speed', content: 'BC! is all about speed which connect you with your friend.',
      image: 'https://images.cdn3.stockunlimited.net/clipart/comic-cloud_1606461.jpg' },
    { title: 'Integrity', content: 'BC! can be done between friends only if they know userId of friends.',
      image: 'https://i.pinimg.com/originals/04/8b/ef/048befd8ebbc954c006ba421c463c918.jpg' },
    { title: 'Authenticated', content: 'BC! is a way to connect between you and your friends only. ',
      image: 'https://i.pinimg.com/736x/e7/03/31/e703311d9e21bd2f6b6b8362e6f0efcc.jpg' },
  ];
  return <Box className="welcome-page-content__whyBC d-flex align-items-center flex-column mt-2">
    <h2 className="heading active">Why BaatCheet?</h2>
    <Box className="d-flex justify-content-center flex-wrap">
      {whyBC_Content.map((i) => {
        return <WhyBcDiv key={`whyBC${i}`} title={i.title} content={i.content} image={i.image} />;
      })}
    </Box>
  </Box>;
};

const WhyBcDiv = (props) => {
  const { title, content, image } = props;
  return <Box className="welcome-page-content__whyBC__content d-flex m-4 p-3
    d-flex align-items-center flex-column mt-3">
    <h5 className="heading">{title}</h5>
    <img src={image} alt={title} />
    <p className="mt-2 ms-3">{content}</p>
  </Box>;
};
export default PageContent;
