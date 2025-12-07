export default function Brands() {
  const logos = [
    "https://cdn.dribbble.com/userupload/32141644/file/original-8118f9295b954d2abb70b432ffad4adb.png?resize=1024x768&vertical=center",
    "https://cdn.dribbble.com/userupload/44884259/file/e60e229eab88ba24add2e63082aa8384.png?resize=1024x767&vertical=center",
    "https://cdn.dribbble.com/userupload/2993780/file/original-d89d28d5d9e45b1ca758af397113ae02.png?resize=1024x768&vertical=center",
    "https://cdn.dribbble.com/userupload/43310611/file/original-2d181e48e4f100770298d0ee2ea80bee.png?resize=1024x768&vertical=center",
  ];

  return (
    <section className="py-10">
      <h2 className="text-xl font-bold mb-6">Our Trusted Brands</h2>
      <div className="flex items-center justify-between opacity-80">
        {logos.map((src) => (
          <img key={src} src={src} className="h-50" />
        ))}
      </div>
    </section>
  );
}
