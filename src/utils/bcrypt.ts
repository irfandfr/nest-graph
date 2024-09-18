import * as bcrypt from 'bcrypt';

export function encodeString(string: string){
  const RANDOM_SALT = bcrypt.genSaltSync()
  return bcrypt.hashSync(string, RANDOM_SALT)
}

export function compareString(string: string, hashedString: string){
  return bcrypt.compareSync(string, hashedString)
}