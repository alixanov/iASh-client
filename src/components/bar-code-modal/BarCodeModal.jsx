import React from 'react';
import Barcode from 'react-barcode'; // Импортируйте react-barcode
import "./bar-code-modal.css";

const BarcodeModal = ({ onClose, product }) => {
     // Проверка, если product неопределен или у него нет barcode, возвращаем null
     if (!product || !product.barcode) {
          return null;
     }

     return (
          <div className='barcode-modal'>
               <div className="barcode-modal-content">
                    <span className='barcode-close' onClick={onClose}>
                         &times;
                    </span>
                    <h2>Штрих-код продукта</h2>
                    <div className="barcode-container">
                         <Barcode value={product.barcode} /> {/* Отображение штрих-кода */}
                    </div>
               </div>
          </div>
     );
}

export default BarcodeModal;