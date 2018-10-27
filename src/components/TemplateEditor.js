import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import pdfUtil from '../utils/pdf';

import image from '../templates/letterpack/base64';

const stringProps = ['prop', 'text'];

const getEmptyData = () => ({
  id: Date.now(), x: 290, y: 113, size: 40, space: 12.5, prop: 'to_zip', text: '1234567',
});

const setIframe = async (pdfData, base64, positionData) => {
  const blob = await pdfUtil.create(pdfData, base64, positionData);
  document.getElementById('pdfIframe').src = URL.createObjectURL(blob);
};

const debounceSetIframe = debounce(setIframe, 500);

const refleshPdf = (datas) => {
  const pdfData = [{}];
  const positionData = {};
  datas.forEach((data) => {
    pdfData[0][data.prop] = data.text;
    positionData[data.prop] = {
      position:
       { x: +data.x, y: +data.y },
      size: +data.size,
      space: +data.space,
    };
  });
  debounceSetIframe(pdfData, image, positionData);
};

class TemplateEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [getEmptyData()],
    };
  }

  componentDidMount() {
    this.forceUpdate(); // this.iframeを再計算させる
    const iframe = document.getElementById('pdfIframe');
    const blob = new Blob(['<div>左のテンプレートを編集して下さい。</div>'], { type: 'text/html' });
    iframe.src = URL.createObjectURL(blob);
  }

   handleChange = ({ key, index }) => (event) => {
     const { datas } = this.state;
     const clonedDatas = JSON.parse(JSON.stringify(datas));
     clonedDatas[index][key] = event.target.value;
     this.setState({ datas: clonedDatas });
     refleshPdf(clonedDatas);
   };


   addData() {
     const { datas } = this.state;
     this.setState({
       datas: datas.concat(getEmptyData()),
     });
   }

   removeData(index) {
     const { datas } = this.state;
     if (datas.length === 1) return;
     this.setState({
       datas: datas.filter((_, _index) => _index !== index),
     });
   }

   render() {
     const { datas } = this.state;
     return (
       <Grid
         container
         justify="space-between"
       >
         <Grid item xs={6}>
           {datas.map((data, index) => (
             <Fragment key={data.id}>
               <form style={{
                 padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
               }}
               >
                 {Object.keys(data).map(key => (
                   key === 'id' ? null : (
                     <MyTextField
                       key={key}
                       target={key}
                       data={data}
                       index={index}
                      type={stringProps.includes(key) ? 'text' : 'number'} // eslint-disable-line 
                       handleChange={this.handleChange.bind(this)}
                     />
                   )
                 ))}
                 <div style={{ width: 70 }}>
                   <Button
                     variant="outlined"
                     size="small"
                     color="primary"
                     disabled={datas.length === 1}
                     onClick={this.removeData.bind(this, index)}
                   >
                      -
                   </Button>
                 </div>
               </form>
               <Divider />
             </Fragment>
           ))}
           <div style={{
             marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center',
           }}
           >
             <Button
               size="small"
               color="primary"
               onClick={this.addData.bind(this)}
             >
              +
             </Button>
           </div>
         </Grid>
         <Grid item xs={6}>
           <iframe
             ref={(node) => { this.iframe = node; }}
             height={`${window.innerHeight - (this.iframe ? this.iframe.getBoundingClientRect().top + 25 : 0)}px`}
             width={`${(window.innerWidth / 2) - 10}px`}
             id="pdfIframe"
             title="PDF"
           />
         </Grid>
       </Grid>
     );
   }
}


function MyTextField({
  target, data, index, type, handleChange,
}) {
  return (
    <TextField
      style={{ width: type === 'text' ? 'auto' : 130 }}
      label={target}
      value={data[target]}
      onChange={handleChange({ key: target, index })}
      type={type}
      multiline={type === 'text'}
      InputLabelProps={{ shrink: true }}
      variant="outlined"
    />
  );
}

MyTextField.propTypes = {
  target: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired, // eslint-disable-line
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default TemplateEditor;
