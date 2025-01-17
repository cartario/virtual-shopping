import React from 'react';

import { StyleSheet } from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroAnimations,
  ViroMaterials,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroNode,
  ViroSpinner,
  ViroFlexView,
  ViroButton,
  ViroCamera,
  Viro360Image,
  ViroVideo,
} from 'react-viro';

import useHttp from '../hooks/useHttp';
import { useSelector, useDispatch } from 'react-redux';
import { plusById, minusById } from '../redux/cartReducer';
import { Menu } from '../ar-components';
import { NAVIGATOR_TYPES } from '../utils';

const BASE_URL =
  'https://virtual-shoping-b52fd-default-rtdb.europe-west1.firebasedatabase.app/products';

const CounterControlPanel = ({ next, currentProductId }) => {
  const [count, setCount] = React.useState(1); 

  const dispatch = useDispatch();

  const handlePlus = () => {
    setCount((prev) => prev + 1);
    dispatch(plusById(currentProductId));
  };

  const handleMinus = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
      dispatch(minusById(currentProductId));
    }
  };

  return (
    <ViroNode
      // rotation={[-30,0,0]}
      onDrag={() => {}}
    >
      <ViroFlexView
        style={{ backgroundColor: 'rgba(75, 75, 75, 0.62)' }}
        height={2}
        width={2}
        position={[0, -1.5, -2.01]}
      ></ViroFlexView>

      <ViroButton
        source={require('../res/btn/move-to-cart/active.png')}
        onClick={next}
        gazeSource={require('../res/btn/move-to-cart/hover.png')}
        position={[0, -2, -2]}
        scale={[1, 1, 1]}
        height={0.25}
        width={1.3925}
      />

      <ViroButton
        source={require('../res/btn/plus/active.png')}
        onClick={handlePlus}
        gazeSource={require('../res/btn/plus/hover.png')}
        clickSource={require('../res/btn/plus/taped.png')}
        position={[-0.5, -1, -2]}
        scale={[1, 1, 1]}
        height={0.25}
        width={0.25}
        onHover={handlePlus}
      />
      <ViroText position={[-0.5, -1, -2]} text={`+`} onClick={handlePlus} />

      <ViroText position={[0.45, -1.25, -2]} text={count.toString()} />

      <ViroButton
        source={require('../res/btn/minus/active.png')}
        onClick={handleMinus}
        onHover={handleMinus}
        gazeSource={require('../res/btn/minus/hover.png')}
        clickSource={require('../res/btn/minus/taped.png')}
        position={[0.5, -1, -2]}
        scale={[1, 1, 1]}
        height={0.25}
        width={0.25}
      />
      <ViroText onClick={handleMinus} position={[0.5, -1, -2]} text={`-`} />
    </ViroNode>
  );
};

export default function ProductScene({ sceneNavigator }) {
  const [data, setData] = React.useState(null);

  const [status, setStatus] = React.useState({
    image: false,
    data: false,
    model: false,
  });

  const { currentProductId } = useSelector(({ test }) => test);
  

  const PRODUCT_URL = `${BASE_URL}/${currentProductId}.json`;

  const { request, loading } = useHttp();

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await request(PRODUCT_URL);
      setData(response);

      if (response) {
        setStatus({
          ...status,
          data: true,
        });
      }
    };

    fetchData();
  }, []);

  const _onInitialized = (state, reason) => {
    if (state == ViroConstants.TRACKING_NORMAL) {
      // setText('ХАКАТОН ВТБ');
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  };

  const handleBackgroundLoaded = () => {
    setStatus({ ...status, image: true });
  };

  const handleMoveToCart = () => {
    sceneNavigator.viroAppProps.navigateTo(NAVIGATOR_TYPES.cart);
  };

  if (!data) {
    return (
      <ViroARScene onTrackingUpdated={_onInitialized}>
        <ViroAmbientLight color="#ffffff" />
        <ViroSpinner visible type="Light" position={[0, 0, -2.5]} />
      </ViroARScene>
    );
  }

  const { description, price, rating, title } = data;

  return (
    <ViroARScene onTrackingUpdated={_onInitialized}>
      <ViroAmbientLight color="#ffffff" />
      <Viro360Image
        format="RGBA8"
        rotation={[0, 80, 0]}
        animation={{ loop: false }}
        source={require('../res/scenes/product-scene-3.jpg')}
        onLoadEnd={handleBackgroundLoaded}
      />
      <ViroSpinner visible={!status.image || !status.data} type="Light" position={[0, 0, -2.5]} />

      <Menu sceneNavigator={sceneNavigator} />
      <CounterControlPanel next={handleMoveToCart} currentProductId={currentProductId} />

      {/*дублирующий текст при изчезании кнопок*/}
      {/* <ViroText
        style={styles.prodTitleText}
        position={[-2, 1, -2]}
        onClick={handleMoveToCart}
        text={`В корзину`}
        width={4}
        height={0.5}
      /> */}

      <ViroVideo
        source={require('../res/video.mp4')}
        loop={true}
        position={[-1.7, -0.2, -7]}
        rotation={[-35, 0, 0]}
        scale={[1.6, 1.2, 0]}
      />

      {/*Плашка с информацией*/}
      <ViroFlexView
        visible={status.image && status.data}
        style={styles.titleContainer}
        position={[3, 1, -7]}
        rotation={[10, -30, 0]}
        height={2}
        width={4}
      >
        <ViroText style={styles.prodTitleText} text={`О продукте:`} width={4} height={0.5} />
        <ViroFlexView style={styles.rowContainer}>
          <ViroText style={styles.prodDescriptionText} text={`Название: ${title}`} />
        </ViroFlexView>
        <ViroFlexView style={styles.rowContainer}>
          <ViroText style={styles.prodDescriptionText} text={`Описание: ${description}`} />
        </ViroFlexView>
        <ViroFlexView style={styles.rowContainer}>
          <ViroText style={styles.prodDescriptionText} text={`Цена: ${price}`} />
        </ViroFlexView>
        <ViroFlexView style={styles.rowContainer}>
          <ViroText style={styles.prodDescriptionText} text={`Рейтинг: ${rating}`} />
        </ViroFlexView>
      </ViroFlexView>

      <ViroNode position={[-1, 0, -0.5]} dragType="FixedToWorld">
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0, -1, -0.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={4}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={0.7}
        />

        {data.model ? (
          <Viro3DObject
            materials={['cola']}
            source={require('../res/cola/model.obj')}
            position={[1, -0.35, -2]}
            rotation={[0, 90, 0]}
            scale={[0.1, 0.1, 0.1]}
            type="OBJ"
            lightReceivingBitMask={5}
            shadowCastingBitMask={4}
            onDrag={() => {}}
            onLoadEnd={() => {
              setStatus({ ...status, model: true });
              handleBackgroundLoaded();
            }}
            animation={{ name: 'rotateY', run: true, loop: true }}
          />
        ) : null}
      </ViroNode>
    </ViroARScene>
  );
}

ViroMaterials.createMaterials({
  tabasco: {
    shininess: 2.0,
    lightingModel: 'Blinn',
    cullMode: 'None',
    diffuseTexture: require('../res/tabasco/texture.jpg'),
  },
  cola: {
    shininess: 2.0,
    lightingModel: 'Blinn',
    cullMode: 'None',
    diffuseTexture: require('../res/cola/texture.png'),
  },
});

ViroAnimations.registerAnimations({
  fadeOut: { properties: { opacity: 0 }, duration: 2000 },
  fadeIn: { properties: { opacity: 1 }, duration: 2000 },
  rotateY: { properties: { rotateY: '+=90' }, duration: 1000 },
});

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: 'red',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    padding: 0.2,
    backgroundColor: '#ffffffdd',
  },
  prodTitleText: {
    fontFamily: 'sans-serif-light',
    fontSize: 30,
    color: '#222222',
    textAlignVertical: 'center',
    textAlign: 'left',
  },

  titleContainer2: {
    flexDirection: 'column',
    backgroundColor: '#ffffffdd',
    padding: 0.2,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  prodDescriptionText: {
    fontFamily: 'sans-serif-light',
    fontSize: 20,
    color: '#222222',
    textAlignVertical: 'center',
    textAlign: 'left',
    flex: 1,
  },
});
