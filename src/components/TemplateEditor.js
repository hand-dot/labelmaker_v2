import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import pdfUtil from '../utils/pdf';

const stringProps = ['Column', 'TestData'];

const getEmptyData = () => ({
  id: Date.now(),
  'x(mm)': 0,
  'y(mm)': 0,
  'size(pt)': 18,
  'space(pt)': 0,
  Column: '',
  TestData: '',
});

const setIframe = async (pdfData, base64, positionData) => {
  const blob = await pdfUtil.create(pdfData, base64, positionData);
  document.getElementById('pdfIframe').src = URL.createObjectURL(blob);
};

const debounceSetIframe = debounce(setIframe, 500);

const refleshPdf = (datas, image) => {
  const pdfData = [{}];
  const positionData = {};
  datas.forEach((data) => {
    pdfData[0][data.Column] = data.TestData;
    positionData[data.Column] = {
      position:
       { x: +data['x(mm)'], y: +data['y(mm)'] },
      size: +data['size(pt)'],
      space: +data['space(pt)'],
    };
  });
  debounceSetIframe(pdfData, image, positionData);
};

class TemplateEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      datas: [getEmptyData()],
    };
  }

  componentDidMount() {
    this.forceUpdate(); // this.iframeを再計算させる
    const iframe = document.getElementById('pdfIframe');
    const blob = new Blob(['<div>左のテンプレートを編集して下さい。</div>'], { type: 'text/html' });
    iframe.src = URL.createObjectURL(blob);
  }

   handleChangeInput = ({ key, index }) => (e) => {
     const { datas, image } = this.state;
     const clonedDatas = JSON.parse(JSON.stringify(datas));
     clonedDatas[index][key] = e.target.value;
     this.setState({ datas: clonedDatas });
     refleshPdf(clonedDatas, image);
   };

   handleChangeFile(event) {
     const { datas } = this.state;
     const files = event.target.files; // eslint-disable-line
     const fileReader = new FileReader();
     fileReader.addEventListener('load', (e) => {
       this.setState({ image: e.target.result }); // eslint-disable-line
       refleshPdf(datas, e.target.result);
     });
     fileReader.readAsDataURL(files[0]);
   }

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
     this.forceUpdate(); // 削除処理をiframeに反映させる
   }

   render() {
     const { datas } = this.state;
     return (
       <Grid
         container
         justify="space-between"
       >
         <Grid item xs={6}>
           <label style={{ padding: 10 }} htmlFor="image">
            Image:
             <input id="image" type="file" accept="image/*" ref={(node) => { this.fileInput = node; }} onChange={this.handleChangeFile.bind(this)} />
           </label>
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
                       handleChange={this.handleChangeInput.bind(this)}
                     />
                   )
                 ))}
                 <div style={{
                   width: 70,
                   display: 'flex',
                   justifyContent: 'flex-end',
                 }}
                 >
                   <Button
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
             padding: 10,
             marginTop: '1rem',
             display: 'flex',
             justifyContent: 'flex-end',
             alignItems: 'center',
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
