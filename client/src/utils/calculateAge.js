import moment from 'moment';

export default function calculateAge(date, format = 'MM/DD/YYYY') {
  return moment().diff(moment(date, format), 'years');
}
