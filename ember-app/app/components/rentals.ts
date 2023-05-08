import { action } from '@ember/object';
import { cancel, debounce } from '@ember/runloop';
import { EmberRunTimer } from '@ember/runloop/types';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import Rental from '../models/rental';

const { round } = Math;

export default class RentalsComponent extends Component {
  @tracked query = '';
  @tracked sort = '';
  @tracked rentals: Rental[] = [];
  @tracked page = 1;
  @service store: any;

  @action
  sortBy(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLSelectElement;
    this.sort = form.value.toString();
    return this.sort;
  }

  @action
  async loadRentals() {
    const options = { page: this.page };
    const res: Rental[] = await this.store.query('rental', options);
    let result: Rental[] = [];
    res.forEach((rental: Rental) => {
      if (rental.id) {
        result.push(rental);
      }
    });
    console.log(result);

    this.rentals = result;
    return this.rentals;
  }

  @action
  async loadMore() {
    console.log('Load more');
    this.page = this.page + 1;
    const options = { page: this.page };

    console.log(this.page);
    try {
      const newRentals: Rental[] = await this.store.query('rental', options);
      let result: Rental[] = [];
      newRentals.forEach((rental: Rental) => {
        if (rental.id) {
          result.push(rental);
          console.log(rental.id);
        }
      });

      this.rentals = this.rentals.concat(result);
      console.log(this.rentals);

      return this.rentals;
    } catch (error) {
      this.page -= 1;
      console.log('No hay mas rentals que mostrar');
    }
  }
}
