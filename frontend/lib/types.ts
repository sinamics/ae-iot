export interface IDevice {
  available: boolean;
  datetime: string;
  electric_price: number;
  electric_time_to_start: string;
  friendly_name: string;
  fuel_price: number;
  fuel_time_to_start: string;
  heater: string;
  client_id: string;
  operational_mode: string;
  system: string;
  uptime: string;
  debug: boolean;
  temperature_setpoint: number;
  electric_gpio_output_pin: number;
  fuel_gpio_output_pin: number;
  temperature_setpoint_gpio_output_pin: number;
}

export interface IUsers {
  name: string;
  email: string;
  createdAt: string;
}
