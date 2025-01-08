import * as yup from 'yup';

export class ValidationService{
  private emailSchema = yup.string()
                        .required('Обязательное поле')
                        .email('Некорректный адрес электронной почты');
  private phoneSchema = yup.string()
                        .matches(/^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{2}[- ]?\d{2}$/, 'Некорректный номер телефона');
  private nonEmptyStringSchema = yup.string()
                                  .required('Обязательное поле')
                                  .test('non-empty', 'Строка не должна быть пустой', value => value.trim() !== '');


  async checkEmail(value: string): Promise<boolean> {
    try {
      await this.emailSchema.validate(value);
      return true;
    }
    catch (error){
      console.error('Email validation: ' + error);
      return false;
    }
  }

  async checkPhone(value:string): Promise<boolean> {
    try {
      await this.phoneSchema.validate(value)
      return true;
    }
    catch (error) {
      console.error('Phone validation: ' + error);
      return false;
    }
  }

  async checkNonEmptyString(value: string): Promise<boolean> {
    try {
      await this.nonEmptyStringSchema.validate(value);
      return true;
    } catch (error) {
      console.error('Not empty validation: ' + error);
      return false;
    }
  }

}