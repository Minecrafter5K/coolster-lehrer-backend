export class CreateLehrerPhotoDto {
  photo: string; // Base64-encoded image

  constructor(photo: string) {
    this.photo = photo;
  }
}
