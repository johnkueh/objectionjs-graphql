import { factory } from 'factory-girl';
import ObjectionAdapter from 'factory-girl-objection-adapter';

factory.setAdapter(new ObjectionAdapter());

export default factory;
