import * as yup from 'yup';

export class ValidationService{
  private emailSchema = yup.string().email('Некорректный адрес электронной почты');
  private phoneSchema = yup.string().matches(/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, 'Некорректный номер телефона');
  private nonEmptyStringSchema = yup.string().required('Обязательное поле').test('non-empty', 'Строка не должна быть пустой', value => value.trim() !== '');

  async checkEmail(value: string): Promise<boolean> {
    try {
      await this.emailSchema.validate(value);
      return true;
    }
    catch (error){
      console.error(error);
      return false;
    }
  }

  async checkPhone(value:string): Promise<boolean> {
    try {
      await this.phoneSchema.validate(value)
      return true;
    }
    catch (error) {
      console.error(error);
      return false;
    }
  }

  async checkNonEmptyString(value: string): Promise<boolean> {
    try {
      await this.nonEmptyStringSchema.validate(value);
      return true;
    } catch (error) {
      return false;
    }
  }

}