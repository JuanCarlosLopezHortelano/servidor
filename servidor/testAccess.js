const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function testAccess() {
  try {
    const [version] = await client.accessSecretVersion({
      name: 'projects/937465366567/secrets/CLAVECORREO/versions/1',
    });
    const datos = version.payload.data.toString('utf8');
    console.log('CLAVECORREO:', datos);
  } catch (error) {
    console.error(`Error al acceder al secreto (CLAVECORREO): ${error.message}`);
  }

  try {
    const [version] = await client.accessSecretVersion({
      name: 'projects/937465366567/secrets/CORREO_GMAIL/versions/1',
    });
    const datos = version.payload.data.toString('utf8');
    console.log('CORREO_GMAIL:', datos);
  } catch (error) {
    console.error(`Error al acceder al secreto (CORREO_GMAIL): ${error.message}`);
  }
}

testAccess();
