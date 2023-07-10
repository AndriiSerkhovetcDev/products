export interface Contact {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  isSelected: boolean,
  isEdit: boolean
}


export interface DuplicateContacts {
  [key: string]: Contact[];
}
